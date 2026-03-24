#ifndef MAX98357A_H
#define MAX98357A_H

#include <Arduino.h>

#define I2S_BCLK 41
#define I2S_LRC  42
#define I2S_DIN  40
#define I2S_SD_MODE 39

#define I2S_SAMPLE_RATE 44100

void initMAX98357A();

void playTone(int frequency, int duration);

void playAudioFile(const char* filename);

void stopAudio();

bool isPlaying();

void testMAX98357A();

#endif
