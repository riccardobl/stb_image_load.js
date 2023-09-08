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
const decodedData=await StbImageLoad.load_image(imageData.length,byteIndex=>{
    // ByteSupplier: this function returns the bytes one by one
    return imageData[byteIndex];
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

