class StbImageLoad {

    static async  _get(){
        if(!StbImageLoad._module) {
            StbImageLoad._module = StbImageLoadModule();
        }
        return StbImageLoad._module;
    }    

    static async load_image(imageSize, byteSupplier, desiredChannels=0, out=undefined, callback=undefined){
        if(!out)out={};

        const Module=await StbImageLoad._get();

        const widthOut=await StbImageLoad.malloc(4);
        const heightOut=await StbImageLoad.malloc(4);
        const channelsOut=await StbImageLoad.malloc(4);
        const imageRawData=await StbImageLoad.malloc(imageSize);
        
        for(let i=0;i<imageSize;){
            let uint8chunk=byteSupplier(i);
            let maxSize=uint8chunk.length;
            if(i+maxSize>imageSize){
                maxSize=imageSize-i;
                uint8chunk=uint8chunk.subarray(0, maxSize);
            }
            Module.HEAPU8.set(uint8chunk, imageRawData+i);
            i+=maxSize; 
        }
        

        const is16Bit = Module._is64bit(imageRawData, imageSize) == 1;

        let imagePtr;
        if(!is16Bit){
            imagePtr = Module._load_image_from_memory(imageRawData, imageSize, widthOut, heightOut, channelsOut, desiredChannels);
        }else{
            imagePtr = Module._load_image_from_memory_16bit(imageRawData, imageSize, widthOut, heightOut, channelsOut, desiredChannels);
        }
       
        out.width = Module.HEAP32[widthOut >>> 2];
        out.height = Module.HEAP32[heightOut >>> 2];
        out.channels = desiredChannels>0?desiredChannels:Module.HEAP32[channelsOut >>> 2];
        if(!is16Bit){
            out.data= Module.HEAPU8.subarray(imagePtr, imagePtr + out.width * out.height * out.channels);
        }else{
            out.data= Module.HEAPU16.subarray(imagePtr >>> 1, (imagePtr >>> 1) + out.width * out.height * out.channels);
        }
        out.bpc=is16Bit?16:8;
        out.bpp=out.channels*out.bpc;
      
        out.length = out.width * out.height * out.channels;
        out.lengthInBytes = out.length * out.bpc/8;
        

        // out.imagePtr=imagePtr;
        // out.imageRawDataPtr=imageRawData;

        await StbImageLoad.free(widthOut);
        await StbImageLoad.free(heightOut);
        await StbImageLoad.free(channelsOut);
        await StbImageLoad.free(imageRawData);
        await StbImageLoad.free(imagePtr);

        if(callback)callback(out);
        return out;        
        
    }

    static async malloc(size){
        const Module=await StbImageLoad._get();
        return Module._stbi_malloc(size);
    }

    static async  free(loadedData, callback=undefined){
        const Module=await StbImageLoad._get();
        if(loadedData.imagePtr){
            Module._stbi_free(loadedData.imagePtr);
            loadedData.imagePtr=undefined;
        }
        if(loadedData.imageRawDataPtr){
            Module._stbi_free(loadedData.imageRawDataPtr);
            loadedData.imageRawDataPtr=undefined;
        }
        if(loadedData.data){
            Module._stbi_free(loadedData.data);
            loadedData.data=undefined;
        }

        if(callback)callback();
    }
}

if (typeof exports === 'object' && typeof module === 'object')
  module.exports = StbImageLoad;

if(window){
    window.StbImageLoad=StbImageLoad;
}