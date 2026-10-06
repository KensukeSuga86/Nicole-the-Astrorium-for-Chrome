#!/bin/bash
cd "$(dirname "$0")"
open -a "Google Chrome" "$PWD/index.html" || echo "Google Chrome が見つかりません。index.html を Chrome で開いてください。"
