#!/bin/bash

# build
ember build --environment=production

# copy node server
rsync -av --exclude=node_modules node pi@pi2b:motionui/

# copy dist
rsync -av dist/* pi@pi2b:motionui/dist/

rsync -av --exclude node_modules --exclude settings.js node/* pi@pi2b:motionui/node/
