#!/bin/bash

build () {
	if ! [ -d public ]; then
		mkdir public
	fi
	NODE_ENV="$1" echo 'Build script is not implemented! Mode=' $1
}

case "$1" in
	'--prod'|'prod')
		build prod
		;;
	'--dev'|'dev'|'')
		build dev
		;;
	*)
		echo 'Unrecognized option: ' "$1"
		exit 1
		;;
esac
