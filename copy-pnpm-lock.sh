#!/bin/sh

CONTAINER_NAME=callpro_app_front

CONTAINER_YARN_LOCK_PATH=/tmp/pnpm-lock.yaml

LOCAL_YARN_LOCK_PATH=./pnpm-lock.yaml

# COMAND TO COPY FILE FROM CONTAINER TO LOCAL MACHINE
docker cp $CONTAINER_NAME:$CONTAINER_YARN_LOCK_PATH $LOCAL_YARN_LOCK_PATH

echo "pnpm-lock.yaml file copied to local machine."