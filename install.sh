#!/usr/bin/env bash
#
# claude-for-codex — One-line installer
# Usage: curl -sfL https://raw.githubusercontent.com/Shiyao-Huang/claude-for-codex/main/install.sh | bash
#
set -euo pipefail

REPO="https://github.com/Shiyao-Huang/claude-for-codex.git"

# Auto-detect Codex home directory
detect_codex_home() {
  # 1. Explicit env var
  if [ -n "${CODEX_HOME:-}" ]; then
    echo "$CODEX_HOME"
    return
  fi
  # 2. Find codex binary and infer config dir
  local codex_bin
  codex_bin=$(command -v codex 2>/dev/null || true)
  if [ -n "$codex_bin" ]; then
    # Check common locations relative to binary
    local codex_dir
    codex_dir="$(dirname "$(dirname "$codex_bin")")/.codex"
    if [ -d "$codex_dir" ]; then
      echo "$codex_dir"
      return
    fi
  fi
  # 3. Check XDG config
  if [ -d "${XDG_CONFIG_HOME:-$HOME/.config}/codex" ]; then
    echo "${XDG_CONFIG_HOME:-$HOME/.config}/codex"
    return
  fi
  # 4. Default
  echo "$HOME/.codex"
}

CODEX_HOME=$(detect_codex_home)
INSTALL_DIR="${CODEX_CLAUDE_DIR:-$CODEX_HOME/claude-for-codex}"
SKILLS_DIR="$CODEX_HOME/skills"
CONFIG_FILE="$CODEX_HOME/config.toml"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${BLUE}[INFO]${NC} $*"; }
ok()    { echo -e "${GREEN}[OK]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# Handle --uninstall
if [ "${1:-}" = "--uninstall" ]; then
  echo -e "${BLUE}Uninstalling claude-for-codex...${NC}"

  # Remove skills
  for skill in claude-code-review claude-code-chat claude-code-prompting; do
    if [ -d "$SKILLS_DIR/$skill" ]; then
      rm -rf "$SKILLS_DIR/$skill"
      ok "Removed skill: $skill"
    fi
  done

  # Remove MCP config entry (multi-platform sed)
  if [ -f "$CONFIG_FILE" ] && grep -q '\[mcp_servers.claude-code\]' "$CONFIG_FILE"; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' '/# claude-for-codex MCP server/d;/\[mcp_servers\.claude-code\]/{N;N;N;d;}' "$CONFIG_FILE" 2>/dev/null || true
    else
      sed -i '/# claude-for-codex MCP server/d;/\[mcp_servers\.claude-code\]/{N;N;N;d;}' "$CONFIG_FILE" 2>/dev/null || true
    fi
    ok "Removed MCP server from $CONFIG_FILE"
  fi

  # Remove install directory
  if [ -d "$INSTALL_DIR" ]; then
    rm -rf "$INSTALL_DIR"
    ok "Removed $INSTALL_DIR"
  fi

  echo ""
  ok "claude-for-codex uninstalled."
  exit 0
fi

# Step 1: Check Node.js
info "Codex home detected: $CODEX_HOME"
info "Checking prerequisites..."
command -v node >/dev/null 2>&1 || error "Node.js is required. Install from https://nodejs.org"
command -v npm >/dev/null 2>&1 || error "npm is required."
command -v git >/dev/null 2>&1 || error "git is required."
NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
[ "$NODE_VERSION" -ge 18 ] || error "Node.js >= 18 required (found $(node -v))"
ok "Node.js $(node -v), npm $(npm -v)"

# Step 2: Clone or update
if [ -d "$INSTALL_DIR/.git" ]; then
  info "Updating existing installation at $INSTALL_DIR..."
  cd "$INSTALL_DIR"
  git stash --quiet 2>/dev/null || true
  git checkout -- . 2>/dev/null || true
  git fetch origin && git reset --hard origin/main || warn "Git update failed, continuing with existing code."
else
  info "Cloning claude-for-codex to $INSTALL_DIR..."
  git clone --depth 1 "$REPO" "$INSTALL_DIR"
  cd "$INSTALL_DIR"
fi

# Step 3: Build
info "Installing dependencies and building..."
npm install --production=false 2>&1 | tail -3
npm run build 2>&1 | tail -3
ok "Build complete."

# Step 4: Install skills to Codex
info "Installing skills to $SKILLS_DIR..."
mkdir -p "$SKILLS_DIR"
for skill_dir in skills/*/; do
  skill_name=$(basename "$skill_dir")
  mkdir -p "$SKILLS_DIR/$skill_name"
  cp "$skill_dir/SKILL.md" "$SKILLS_DIR/$skill_name/SKILL.md"
  ok "Skill installed: $skill_name"
done

# Step 5: Clean up old MCP entries and register new one
info "Registering MCP server in Codex config..."
mkdir -p "$(dirname "$CONFIG_FILE")"
touch "$CONFIG_FILE"

# Remove old [mcp_servers.claude] entry if it points to our install dir
if grep -q '\[mcp_servers\.claude\]' "$CONFIG_FILE" 2>/dev/null; then
  if grep -A2 '\[mcp_servers\.claude\]' "$CONFIG_FILE" | grep -q "claude-for-codex" 2>/dev/null; then
    info "Removing old [mcp_servers.claude] entry..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' '/\[mcp_servers\.claude\]/{N;N;d;}' "$CONFIG_FILE" 2>/dev/null || true
    else
      sed -i '/\[mcp_servers\.claude\]/{N;N;d;}' "$CONFIG_FILE" 2>/dev/null || true
    fi
  fi
fi

# Check if already registered
if grep -q '\[mcp_servers.claude-code\]' "$CONFIG_FILE" 2>/dev/null; then
  warn "MCP server 'claude-code' already registered. Updating path..."
  # Use sed to update the args path
  if command -v sed >/dev/null 2>&1; then
    sed -i.bak "s|args = \[.*\]|args = [\"$INSTALL_DIR/dist/index.js\"]|" "$CONFIG_FILE" 2>/dev/null || true
  fi
else
  echo "" >> "$CONFIG_FILE"
  echo "# claude-for-codex MCP server" >> "$CONFIG_FILE"
  echo "[mcp_servers.claude-code]" >> "$CONFIG_FILE"
  echo "command = \"node\"" >> "$CONFIG_FILE"
  echo "args = [\"$INSTALL_DIR/dist/index.js\"]" >> "$CONFIG_FILE"
fi
ok "MCP server registered as 'claude-code' in $CONFIG_FILE"

# Step 6: Done
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  claude-for-codex installed successfully!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Restart Codex to start using. Available tools:"
echo "  - claude-code-review  (code review via Claude Code)"
echo "  - claude-code-chat    (general Claude Code chat)"
echo ""
echo "Skills installed:"
for skill_dir in skills/*/; do
  skill_name=$(basename "$skill_dir")
  echo "  - $skill_name"
done
echo ""
echo "No API key needed — if Claude Code is installed and logged in, it just works."
echo ""
echo "To uninstall:"
echo "  curl -sfL https://raw.githubusercontent.com/Shiyao-Huang/claude-for-codex/main/install.sh | bash -s -- --uninstall"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
