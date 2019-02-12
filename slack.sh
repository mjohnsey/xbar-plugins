#! /bin/bash

status_json=$(curl -s https://status.slack.com/api/current)
# TODO: To test use this file
# status_json=$(cat /Users/mjohnsey/dev/github.com/mjohnsey/bitbar-plugins/tests/slack_test.json)

status=$(echo "${status_json}" | jq -r '.status')

down_status="🔴"
up_status="👌"

status_light="${down_status}"
error_msg=""
services=""
if [ "${status}" = "ok" ]
then
    status_light="${up_status}"
else
    error_msg="${status}"
    services=$(echo "${status_json}" | jq -r -c '.services[]')
    type=$(echo "${status_json}" | jq -r -c '.type')
    incident_url=$(echo "${status_json}" | jq -r -c '.url')
    date_create=$(echo "${status_json}" | jq -r -c '.date_created')
fi

echo ${status_light}
echo "---"
if [ "${error_msg}" != "" ]
then
    echo "Type: ${type}|href=${incident_url}"
    echo "Affected Services:"
    echo "${services}"
    echo "Start Time: ${date_create}"
fi

echo "Last checked: $(date "+%Y%m%d %H:%M:%S")"
