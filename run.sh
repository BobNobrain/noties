#!/bin/bash

cd "$( dirname "${BASH_SOURCE[0]}" )"

run () {
	NODE_ENV="$1" node ./index.js
}

case "$1" in
	'--prod'|'prod')
		run prod
		;;
	'--dev'|'dev'|'')
		run dev
		;;
	*)
		echo 'Unrecognized option: ' "$1"
		exit 1
		;;
esac
