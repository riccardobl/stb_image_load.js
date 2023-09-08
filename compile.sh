#!/bin/bash
mkdir -p build
echo "" > build/stb_image_load.js

emcc stb_image_load.c \
-o build/stb_image_load.js \
-s WASM=0 \
-s EXPORTED_RUNTIME_METHODS="['ccall','getValue']" \
-s MODULARIZE=1 -s EXPORT_NAME="StbImageLoadModule" \
-O3 \
--memory-init-file 0 \
-s ALLOW_MEMORY_GROWTH=1

echo -e "\n" >> build/stb_image_load.js
cat stb_image_load.js >> build/stb_image_load.js

cp test/* build/