#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/import_notes.py
bundle exec jekyll build --source .build/source --destination .build/next --config .build/source/_config.yml --trace
python3 scripts/check_output.py .build/next
# Keep last successful local output on build/check failure.
rm -rf _site
mv .build/next _site
