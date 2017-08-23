#!/bin/bash

cd "$( dirname "${BASH_SOURCE[0]}" )"

build () {
	if ! [ -d public ]; then
		mkdir public
	fi
	NODE_ENV="$1" ./node_modules/.bin/webpack --config webpack.config.js
}

case "$1" in
	'--prod'|'prod')
		build prod
		;;
	'--dev'|'dev'|'')
		build dev
		;;
	'clear')
		if [ -d public ]; then
			rm -rf public
		fi
		mkdir public
		;;
	*)
		echo 'Unrecognized option: ' "$1"
		exit 1
		;;
esac
