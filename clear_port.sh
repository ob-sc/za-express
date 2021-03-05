#!/bin/bash

PORT=8000
GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m' # No Color

PID=$(lsof -i :$PORT -t)
if [ -z $PID ]
    then
        printf "\n$GREEN  port $PORT free $NC\n"
    else
        kill $PID
        printf "\n$RED  cleared port $PORT $NC\n"
fi
