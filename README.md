# stb_image_load.js

Minimalistic JavaScript library to load 8bit and 16bit int images using stb_image.h compiled with emscripten.
The goal of this small library is to provide a simple way to load 16bit and 8bit PNG images, the other formats supported by stb_image.h should work as well but are not tested.

Nb. Some design choices have been made to simplify the usage from a teavm application.

## Usage
1. Download the library from the release page.
2. Include the library in your html file.
```html
    <script src="./stb_image_load.js"></script>
```
3. Load and use an image
```javascript
// Fetch the image data
const encodedData=new Uint8Array(await fetch(imageUrl).then(res=>res.arrayBuffer()));
// Decode with stb_image
const imageLen=imageData.length;
const chunk=new Uint8Array(1024); // 1KB chunk sizes
const decodedData=await StbImageLoad.load_image(imageLen,offset=>{
    // ByteSupplier: this function returns an Uint8Array containing a chunk of the image data
    // the Uint8Array can be reused in the next call to this function.
    // The next call to this function will have an offset that is the sum of the offset passed to this function and the length of the chunk returned by this function.
    // Nb. Uint8Array can be of any fixed size and can contain garbage data past the end of imageLen, since only up to imageLen bytes will be read.
    // The provided example will work for any image size, tweak it only if you want to optimize the loading speed for your specific image sizes.
    const start=offset;
    const end=Math.min(offset+chunk.length,imageLen);
    for (let i = start, j = 0; i < end; i++, j++) {
        chunk[j] = imageData[i];
    }
    return chunk;
});
// use the image 
// const width=decodedData.width;
// const height=decodedData.height;
// const channels=decodedData.channels;
// const bitsPerChannel=decodedData.bpc;
// const bitsPerPixel=decodedData.bpp;
// const is16bit=bitsPerChannel==16;
// const data=decodedData.data; // Uint8Array if 8bit or Uint16Array if 16bit
// ...
// ...

// Free the image data when you don't need it anymore (!!! important !!!)
// nb this will destroy decodedData.data, so make sure you don't use it after this call
StbImageLoad.free(decodedData); 

```

