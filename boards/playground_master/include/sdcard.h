// Made for playground_master
#ifndef SDCARD_H
#define SDCARD_H

#include <Arduino.h>

#define SD_CS_PIN 5
#define SD_MOSI_PIN 20
#define SD_CLK_PIN 18
#define SD_MISO_PIN 19

bool initSDCard();

bool sdWriteFile(const char* path, const char* message);

String sdReadFile(const char* path);

bool sdAppendFile(const char* path, const char* message);

bool sdDeleteFile(const char* path);

bool sdExists(const char* path);

String sdListFiles();

void testSDCard();

int openAudioFile(const char* filename);

int readAudioChunk(int handle, uint8_t* buffer, int maxBytes);

void closeAudioFile(int handle);

bool getAudioFileInfo(const char* filename, uint32_t* size);

uint32_t getAudioFilePosition(int handle);

bool isAudioFileOpen(int handle);

#endif
