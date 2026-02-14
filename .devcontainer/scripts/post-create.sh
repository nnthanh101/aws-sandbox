#!/bin/bash
# =============================================================================
# post-create.sh - Setup after container creation
# aws-sandbox DevContainer (ADLC v3.2.0)
# =============================================================================
set -euo pipefail

echo "🔧 post-create: Environment setup..."

# Create ADLC evidence directories
mkdir -p tmp/aws-sandbox/{coordination-logs,test-results,evidence,screenshots,build-logs} 2>/dev/null
echo "  ✅ Evidence directories"

# Install project dependencies
if [ -f "package.json" ]; then
    echo "  📦 Installing npm dependencies..."
    npm install --prefer-offline 2>/dev/null && \
        echo "  ✅ npm dependencies installed" || \
        echo "  ⚠️  npm install failed - run manually: npm install"
fi

# Check AWS credential mount
if [ -d "${HOME}/.aws" ]; then
    if aws sts get-caller-identity &>/dev/null; then
        echo "  ✅ AWS authenticated"
    else
        echo "  ⚠️  AWS: run 'aws sso login' on HOST"
    fi
else
    echo "  ⚠️  AWS: mount ~/.aws (for Tier 3 testing)"
fi

# Setup shell aliases for interactive use
if ! grep -q "alias ll=" ~/.bashrc 2>/dev/null; then
    cat >> ~/.bashrc << 'ALIASES'

# aws-sandbox DevContainer shell aliases (ADLC v3.2.0)
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias cls='clear'
ALIASES
    echo "  ✅ Shell aliases (~/.bashrc)"
fi

# System-wide aliases (ensures VS Code terminals always have aliases)
if [ -w /etc/bash.bashrc ] && ! grep -q "DevContainer shell aliases" /etc/bash.bashrc 2>/dev/null; then
    cat >> /etc/bash.bashrc << 'SYSALIASES'

# aws-sandbox DevContainer shell aliases (ADLC v3.2.0)
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias cls='clear'
SYSALIASES
    echo "  ✅ Shell aliases (/etc/bash.bashrc)"
fi

# Ensure login shells source .bashrc
if ! grep -q "source.*\.bashrc" ~/.bash_profile 2>/dev/null; then
    echo -e '\n# Source .bashrc for login shells\n[[ -f ~/.bashrc ]] && source ~/.bashrc' >> ~/.bash_profile
    echo "  ✅ .bash_profile sources .bashrc"
fi

echo "✅ post-create complete"
