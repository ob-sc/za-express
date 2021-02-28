#!/bin/bash
PORT=8000
PID=$(lsof -i ":$PORT" -t)
if [ -z $PID ]
    then
        echo "port free"
    else
        kill $PID
        echo "cleared port $PORT"
fi
