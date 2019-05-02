#!/bin/bash

cd "$(dirname ${BASH_SOURCE[0]})"

PLYRDIR=node_modules/plyr

if [ ! -d plyr ]; then
    mkdir plyr
fi

echo "Copying Plyr dist to local package dir"
cp -f $PLYRDIR/dist/* plyr

exit
