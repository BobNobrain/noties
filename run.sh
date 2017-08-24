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
	echo 'Waiting mongodb to start...'
	sleep 1
	export DB_IP=`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' noties-db`
	echo 'DB server started at' $DB_IP
	node setup_db.js $*
}

clean () {
	docker rm -f noties-db
	rm -rf data
	mkdir data
}

case "$1" in
	'--prod'|'prod')
		run prod
		;;
	'--dev'|'dev'|'')
		run dev
		;;
	'db'|'--db')
		rundb $*
		;;
	'clean'|'--clean')
		clean
		;;
	*)
		echo 'Unrecognized option: ' "$1"
		exit 1
		;;
esac
