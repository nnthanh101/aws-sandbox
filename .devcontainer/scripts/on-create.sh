#!/bin/bash
# =============================================================================
# on-create.sh - One-time container setup (runs only on container creation)
# aws-sandbox DevContainer (nnthanh101/terraform image)
# =============================================================================
set -euo pipefail

echo "🔧 on-create: One-time setup..."

# Fix machine-id (no sudo needed - using || true for non-fatal)
if [ ! -f /etc/machine-id ] || [ ! -s /etc/machine-id ]; then
    cat /proc/sys/kernel/random/uuid 2>/dev/null | tr -d '-' | head -c 32 > /tmp/machine-id 2>/dev/null || true
    [ -s /tmp/machine-id ] && cat /tmp/machine-id | tee /etc/machine-id >/dev/null 2>&1 || true
    rm -f /tmp/machine-id
    echo "  ✅ machine-id"
fi

# Create cache directories with proper permissions
mkdir -p ~/.cache/starship ~/.npm 2>/dev/null || true
echo "  ✅ cache directories"

echo "✅ on-create complete"
