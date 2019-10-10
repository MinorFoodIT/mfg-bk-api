#!/bin/bash

stop() {
    echo "docker-compose stop"
    docker-compose stop

    echo "docker-compose remove"
    docker-compose rm -f
}

remove() {
    docker-compose down
}

start() {
    echo "docker compose run with build image "
    docker-compose up -d --build
}

db-table-setup() {
    echo "timezone"
    cat db/timezone.sql | docker exec -i mfg-bk-db /usr/bin/mysql -u root --password=root

    echo "create tables"
    cat db/create-tables.sql | docker exec -i mfg-bk-db /usr/bin/mysql -u root --password=root storeasservice

    echo "setup sites"
    cat db/sites.sql | docker exec -i mfg-bk-db /usr/bin/mysql -u root --password=root storeasservice
}

db-backup() {
    # Backup
    docker exec mfg-bk-db /usr/bin/mysqldump -u root --password=root bkapi > backup.sql
}

db-restore() {
    # Backup
    cat backup.sql | docker exec -i mfg-bk-db /usr/bin/mysql -u root --password=root bkapi
}


case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  remove)
     remove
     ;;
  db-table-setup)
     db-table-setup
     ;;
  db-restore)
     db-restore
     ;;
  db-backup)
     db-backup
     ;;
  *)
    echo "Usage: $0 start|stop|remove" >&2
    exit 3
    ;;
esac
