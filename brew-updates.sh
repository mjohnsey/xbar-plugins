#! /bin/bash

brew_outdated_output=$(/usr/local/bin/brew outdated)
# TODO: To test use this file
# brew_outdated_output=$(cat /Users/mjohnsey/dev/src/github.com/mjohnsey/bitbar-plugins/tests/brew-outdated-test.txt)

num_of_lines=$(echo "${brew_outdated_output}" | sed '/^\s*$/d' | wc -l)

zero_updates_pending="🥚"
update_status=${zero_updates_pending}
updates=""

if [ "$num_of_lines" -gt 0 ]; then
    update_status="🍄$num_of_lines"
    updates=${brew_outdated_output}
fi

echo "${update_status}"
echo "---"
echo "$updates"

echo "Num of brew updates - ${num_of_lines}"
echo "Last checked: $(date "+%Y-%m-%d %H:%M:%S")"
