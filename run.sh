#!/bin/bash

cd "$( dirname "${BASH_SOURCE[0]}" )"

run () {
	NODE_ENV="$1" DB_IP=`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' noties-db` node ./app/index.js
}

rundb () {
	if ! [ -d ./data ]; then
		mkdir data
	fi
	docker run -v "$(pwd)/data":/data --name noties-db -d mongo:3
	if ! [[ "$2." == "" || "$2." == "--fake-data." ]]; then
		echo 'Unrecognized option for run db:' "$2"
		exit 1
	fi
	node setup_db.js "$2"
}

case "$1" in
	'--prod'|'prod')
		run prod
		;;
	'--dev'|'dev'|'')
		run dev
		;;
	'db'|'--db')
		rundb "$2"
		;;
	*)
		echo 'Unrecognized option: ' "$1"
		exit 1
		;;
esac
