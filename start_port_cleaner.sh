#!/bin/bash
echo "Port Cleaner Deamon Starting..."
while true; do
  $(which node) /home/aliv/Desktop/Projeler/02.-yenievent/port_cleaner.js >> /home/aliv/Desktop/Projeler/02.-yenievent/port_cleaner.log 2>&1
  sleep 900
done
