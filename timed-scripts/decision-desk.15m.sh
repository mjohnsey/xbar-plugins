#! /bin/bash

set -e

output=$(/usr/local/bin/docker run --rm decision-desk)
echo "🇺🇸"
echo "---"
echo $output | /usr/local/bin/jq -r 'keys[] as $k | "\($k) - \(.[$k] | .tldr)"'
