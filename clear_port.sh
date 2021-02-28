#!/bin/bash

#PORT=8000
GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m' # No Color

if [ -z $PORT ]
    then
        printf "  no port var in env\n"
        PORT=8000
fi

PID=$(lsof -i :$PORT -t)
if [ -z $PID ]
    then
        printf "$GREEN  port $PORT free $NC\n"
    else
        kill $PID
        printf "$RED  cleared port $PORT $NC\n"
fi
