#!/bin/bash

cd "$(dirname ${BASH_SOURCE[0]})"

PLYRDIR=node_modules/plyr

if [ ! -d plyr ]; then
    mkdir plyr
fi

echo "Copying Plyr dist to local package dir"
cp -f $PLYRDIR/dist/* plyr
rm -f plyr/*.mjs
rm -f plyr/*.map

#
# Apply more speed settings
#
sed -i 's/0.5, 0.75, 1, 1.25, 1.5, 1.75, 2/0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2/g' plyr/plyr.js
sed -i 's/.5,.75,1,1.25,1.5,1.75,2/.5,.6,.7,.8,.9,1,1.1,1.25,1.5,1.75,2/g' plyr/plyr.min.js
sed -i 's/0.5, 0.75, 1, 1.25, 1.5, 1.75, 2/0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2/g' plyr/plyr.polyfilled.js
sed -i 's/.5,.75,1,1.25,1.5,1.75,2/.5,.6,.7,.8,.9,1,1.1,1.25,1.5,1.75,2/g' plyr/plyr.polyfilled.min.js

exit
