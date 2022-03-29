#!/bin/bash

BASE="$(cd "$(dirname "$(realpath "${BASH_SOURCE[0]}")")" &> /dev/null && pwd )"
cd "$BASE"

docker build ../ -f ../docker/Dockerfile -t jolocom/bamf-ap-101
