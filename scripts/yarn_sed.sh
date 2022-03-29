#!/bin/bash -

set -e # stop executing on error

DEFAULT_REGISTRY="https://registry.yarnpkg.com/"
ARTIFACTORY="https://server.art.intern/api/npm/npm-repos/"
PACKAGES=("./demo" "./jolocom-lib" "./")

if grep -q $DEFAULT_REGISTRY ./yarn.lock; then
  FROM_REGISTRY="$DEFAULT_REGISTRY"
  TO_REGISTRY="$ARTIFACTORY"
else
  FROM_REGISTRY="$ARTIFACTORY"
  TO_REGISTRY="$DEFAULT_REGISTRY"
fi

echo yarn.lock files will be switched to "$TO_REGISTRY"

for PKG in ${PACKAGES[@]}; do
  sed -i -e "s#${FROM_REGISTRY}#${TO_REGISTRY}#g" $PKG/yarn.lock
done


echo now please run:
echo yarn install
