#! /bin/bash

/opt/homebrew/bin/brew update &>/dev/null
brew_outdated_output=$(/opt/homebrew/bin/brew outdated)
# TODO: To test use this file
# BASEDIR=$(dirname "$0")
# brew_outdated_output=$(cat ${BASEDIR}/../../tests/brew-outdated-test.txt)

num_of_lines=$(echo "${brew_outdated_output}" | sed '/^\s*$/d' | wc -l)
num_of_lines="$(echo -e "${num_of_lines}" | tr -d '[:space:]')"

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
