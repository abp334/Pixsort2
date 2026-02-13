#!/usr/bin/env bash
# Exit on error
set -o errexit

# Upgrade pip and install build tools
cd "$(dirname "$0")"
pip install --upgrade pip
pip install setuptools wheel

# Install the dependencies
pip install -r requirements.txt
pip install pillow-avif-plugin