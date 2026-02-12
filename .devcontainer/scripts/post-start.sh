#!/bin/bash
# =============================================================================
# post-start.sh - Runs every time the container starts
# aws-sandbox DevContainer (ADLC v3.0.0)
#
# AUTONOMOUS SELF-HEALING:
# - Validates node_modules on every start
# - Auto-installs if missing
# =============================================================================

# Helper: Get version (returns - if not found)
ver() { command -v "$1" &>/dev/null && ("$1" --version 2>&1 | grep -oE '[0-9]+\.[0-9]+(\.[0-9]+)?' | head -1) || echo "-"; }

# =============================================================================
# SELF-HEALING: npm install if node_modules missing
# =============================================================================
if [ ! -d "node_modules" ] && [ -f "package.json" ]; then
    echo "🔧 Self-healing: node_modules missing, running npm install..."
    npm install --prefer-offline 2>/dev/null && \
        echo "  ✅ node_modules restored" || \
        echo "  ⚠️  npm install failed - run manually"
fi

cat << EOF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏖️  aws-sandbox DevContainer (ADLC ${ADLC_VERSION:-3.0.0})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

printf "\n%-12s %-10s  %-12s %-10s\n" "Tool" "Version" "Tool" "Version"
printf "%-12s %-10s  %-12s %-10s\n"   "────────" "────────" "────────" "────────"
printf "%-12s %-10s  %-12s %-10s\n"   "node"      "$(ver node)"       "aws"        "$(ver aws)"
printf "%-12s %-10s  %-12s %-10s\n"   "npm"       "$(ver npm)"        "terraform"  "$(ver terraform)"
printf "%-12s %-10s  %-12s %-10s\n"   "cdk"       "$(ver cdk)"        "task"       "$(ver task)"
printf "%-12s %-10s  %-12s %-10s\n"   "git"       "$(ver git)"        "starship"   "$(ver starship)"

echo ""
echo "Node: $(which node 2>/dev/null || echo 'not found')"

# =============================================================================
# AWS SSO Session Validation (single profile, configurable)
# =============================================================================
if [ -d "${HOME}/.aws" ]; then
    if aws sts get-caller-identity &>/dev/null; then
        ACCOUNT=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "unknown")
        echo "AWS: ✅ authenticated (account: ${ACCOUNT})"
    else
        echo "AWS: ⚠️  run on HOST: aws sso login --profile <your-profile>"
        echo "     Container inherits SSO cache via volume mount (~/.aws)"
    fi
else
    echo "AWS: ⚠️  ~/.aws not mounted (Tier 3 testing unavailable)"
fi

cat << 'EOF'

⚡ task --list | task test:tier1:docker | task synth
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
