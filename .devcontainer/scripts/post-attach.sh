#!/bin/bash
# =============================================================================
# post-attach.sh - Runs when VS Code attaches to the container
# aws-sandbox DevContainer
# =============================================================================

# Ensure starship cache dir exists (fallback if on-create didn't run)
mkdir -p ~/.cache/starship 2>/dev/null || export STARSHIP_CACHE=/tmp/starship-cache && mkdir -p $STARSHIP_CACHE

# Start login shell (loads .bashrc which initializes starship)
exec bash --login
