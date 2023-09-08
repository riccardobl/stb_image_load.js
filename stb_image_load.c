#define STB_IMAGE_IMPLEMENTATION

#define STBI_NO_STDIO
#define STBI_ASSERT(...)

#define STBI_NO_HDR
#define STBI_NO_LINEAR


#include "stb_image.h"
#include <stdint.h>

#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
unsigned char* load_image_from_memory(const unsigned char* data, int size, int* width, int* height, int* channels_in_file, int desired_channels) {
    return  stbi_load_from_memory(data, size, width, height, channels_in_file, desired_channels);
}

EMSCRIPTEN_KEEPALIVE
unsigned short* load_image_from_memory_16bit(const unsigned char*buffer, int len, int *x, int *y, int *channels_in_file, int desired_channels){
    return stbi_load_16_from_memory(buffer, len, x, y, channels_in_file, desired_channels);
}


EMSCRIPTEN_KEEPALIVE
void* stbi_malloc(size_t size) {
    return STBI_MALLOC(size);
}

EMSCRIPTEN_KEEPALIVE
void stbi_free(void* ptr) {
    STBI_FREE(ptr);
}

EMSCRIPTEN_KEEPALIVE
int is64bit(const unsigned char* data,int size){
    return stbi_is_16_bit_from_memory(data, size);
}