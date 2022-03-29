#!/bin/bash

set -e

BAMF_AP="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null && pwd )"
DOCKER_IMAGE="jolocom/bamf-ap-101"
WEB_SPACE="/home/infra/worktrees/jolocom-wp/wp-content/secret"

cd $BAMF_AP
./scripts/docker.sh

set -x
IMAGE_OUT_FILE="BAMF-AP-101-ProofChainingPrototype-${GIT_REF}.tar.gz"
IMAGE_OUT_PATH="$WEB_SPACE/$IMAGE_OUT_FILE"
docker save \
  -o "$IMAGE_OUT_PATH" \
  $DOCKER_IMAGE
set +x
chmod a+r "$IMAGE_OUT_PATH"

echo get the image from
echo https://jolocom.io/${WEB_SPACE##*jolocom-wp/}/${IMAGE_OUT_FILE}
echo then load it up using:
echo docker load -i \"$IMAGE_OUT_FILE\"


