#include "max98357a.h"
#include "oled.h"
#include "sdcard.h"
#include <driver/i2s.h>
#include <string.h>

static bool i2sInitialized = false;

#define I2S_NUM         I2S_NUM_0
#define I2S_DMA_BUF_COUNT 32
#define I2S_DMA_BUF_LEN   1024

static const i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX),
    .sample_rate = I2S_SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_RIGHT_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = I2S_DMA_BUF_COUNT,
    .dma_buf_len = I2S_DMA_BUF_LEN,
    .use_apll = false,
    .tx_desc_auto_clear = true,
    .fixed_mclk = 0
};

static const i2s_pin_config_t pin_config = {
    .bck_io_num = I2S_BCLK,
    .ws_io_num = I2S_LRC,
    .data_out_num = I2S_DIN,
    .data_in_num = I2S_PIN_NO_CHANGE
};

void initMAX98357A() {
    if (i2sInitialized) return;

    Serial.begin(115200);
    delay(100);

    initOLED();
    initSDCard();

    pinMode(I2S_SD_MODE, OUTPUT);
    digitalWrite(I2S_SD_MODE, HIGH);

    i2s_driver_install(I2S_NUM, &i2s_config, 0, NULL);
    i2s_set_pin(I2S_NUM, &pin_config);

    i2sInitialized = true;
}

void playTone(int frequency, int duration) {
    if (!i2sInitialized) return;

    writeToOled("Tone: %dHz\n%dms", frequency, duration);

    const int sampleRate = I2S_SAMPLE_RATE;
    const int samplesPerCycle = sampleRate / frequency;
    const int totalSamples = (sampleRate * duration) / 1000;

    int16_t *samples = (int16_t*)malloc(totalSamples * sizeof(int16_t));
    if (samples == NULL) {
        writeToOled("Memory error");
        return;
    }

    for (int i = 0; i < totalSamples; i++) {
        float t = (float)i / sampleRate;
        float value = sin(2.0 * PI * frequency * t);
        samples[i] = (int16_t)(value * 32767 * 0.5);
    }

    size_t bytesWritten;
    i2s_write(I2S_NUM, samples, totalSamples * sizeof(int16_t), &bytesWritten, portMAX_DELAY);

    free(samples);
}

void stopAudio() {
    if (!i2sInitialized) return;

    i2s_zero_dma_buffer(I2S_NUM);
}

void testMAX98357A() {
    if (!i2sInitialized) {
        initMAX98357A();
    }

    writeToOled("Test: SD Card");
    delay(1000);

    uint32_t dummySize;
    bool sdAvailable = getAudioFileInfo("test.wav", &dummySize);
    bool wavExists = false;

    if (sdAvailable) {
        wavExists = (openAudioFile("test.wav") >= 0);
        if (wavExists) {
            closeAudioFile(0);
        }
    }

    if (wavExists) {
        playAudioFile("test.wav");
    } else {
        writeToOled("Test: Triad");
        playTone(262, 500);
        playTone(330, 500);
        playTone(392, 500);
        playTone(523, 500);
    }

    clearOled();
    stopAudio();
}

typedef struct {
    uint32_t sampleRate;
    uint16_t numChannels;
    uint16_t bitsPerSample;
    uint32_t dataSize;
    uint32_t dataOffset;
} WavHeader;

static bool parseWavHeader(uint8_t* buffer, int bufLen, WavHeader* header) {
    if (bufLen < 44) return false;

    if (buffer[0] != 'R' || buffer[1] != 'I' || buffer[2] != 'F' || buffer[3] != 'F') {
        return false;
    }

    if (buffer[8] != 'W' || buffer[9] != 'A' || buffer[10] != 'V' || buffer[11] != 'E') {
        return false;
    }

    header->sampleRate = 44100;
    header->numChannels = 1;
    header->bitsPerSample = 16;
    header->dataSize = 0;
    header->dataOffset = 44;

    int pos = 12;
    while (pos < bufLen - 8) {
        uint32_t chunkSize = buffer[pos + 4] | (buffer[pos + 5] << 8) |
                             (buffer[pos + 6] << 16) | (buffer[pos + 7] << 24);

        if (buffer[pos] == 'f' && buffer[pos + 1] == 'm' && buffer[pos + 2] == 't' && buffer[pos + 3] == ' ') {
            if (pos + 8 + 16 <= bufLen) {
                uint16_t audioFormat = buffer[pos + 8] | (buffer[pos + 9] << 8);
                if (audioFormat != 1) {
                    return false;
                }
                header->numChannels = buffer[pos + 10] | (buffer[pos + 11] << 8);
                header->sampleRate = buffer[pos + 12] | (buffer[pos + 13] << 8) |
                                     (buffer[pos + 14] << 16) | (buffer[pos + 15] << 24);
                header->bitsPerSample = buffer[pos + 22] | (buffer[pos + 23] << 8);
            }
        }
        else if (buffer[pos] == 'd' && buffer[pos + 1] == 'a' && buffer[pos + 2] == 't' && buffer[pos + 3] == 'a') {
            header->dataSize = chunkSize;
            header->dataOffset = pos + 8;
            break;
        }

        pos += 8 + chunkSize;
        if (chunkSize & 1) pos++;
    }

    return (header->dataSize > 0);
}

void playAudioFile(const char* filename) {
    if (!i2sInitialized) {
        initMAX98357A();
    }

    writeToOled("Opening:\n%s", filename);
    delay(500);

    int handle = openAudioFile(filename);
    if (handle < 0) {
        writeToOled("File not found:\n%s", filename);
        delay(2000);
        clearOled();
        return;
    }

    uint32_t fileSize = 0;
    getAudioFileInfo(filename, &fileSize);

    writeToOled("File: %s\nSize: %lu bytes", filename, fileSize);
    delay(1000);

    {
        uint8_t* headerBuffer = (uint8_t*)malloc(2048);
        if (headerBuffer == NULL) {
            writeToOled("Memory error");
            closeAudioFile(handle);
            delay(2000);
            clearOled();
            return;
        }
        int headerRead = readAudioChunk(handle, headerBuffer, 2048);

        if (headerRead < 44) {
            writeToOled("Invalid WAV\nheader");
            free(headerBuffer);
            closeAudioFile(handle);
            delay(2000);
            clearOled();
            return;
        }

        WavHeader wavHeader;
        if (!parseWavHeader(headerBuffer, headerRead, &wavHeader)) {
            uint16_t audioFormat = headerBuffer[20] | (headerBuffer[21] << 8);
            writeToOled("WAV parse fail\nfmt: %d", audioFormat);
            free(headerBuffer);
            closeAudioFile(handle);
            delay(2000);
            clearOled();
            return;
        }

        i2s_set_sample_rates(I2S_NUM, wavHeader.sampleRate);

        int chunkSize = 16384;
        int bufferSize = 65536;
        uint8_t* audioBuffer = (uint8_t*)malloc(bufferSize);
        if (audioBuffer == NULL) {
            writeToOled("Memory error");
            free(headerBuffer);
            closeAudioFile(handle);
            delay(2000);
            clearOled();
            return;
        }

        uint32_t bytesPlayed = 0;
        int progressCounter = 0;

        if (headerRead > (int)wavHeader.dataOffset) {
            int initialBytes = headerRead - wavHeader.dataOffset;
            memcpy(audioBuffer, headerBuffer + wavHeader.dataOffset, initialBytes);

            size_t bytesWritten = 0;
            if (wavHeader.bitsPerSample == 16 && wavHeader.numChannels == 2) {
                i2s_write(I2S_NUM, audioBuffer, initialBytes, &bytesWritten, portMAX_DELAY);
                bytesPlayed += initialBytes;
            } else if (wavHeader.bitsPerSample == 24 && wavHeader.numChannels == 2) {
                int frames = initialBytes / 6;
                int16_t* converted = (int16_t*)audioBuffer;
                for (int i = 0; i < frames; i++) {
                    int32_t left = audioBuffer[i*6] | (audioBuffer[i*6+1] << 8);
                    int32_t right = audioBuffer[i*6+3] | (audioBuffer[i*6+4] << 8);
                    converted[i] = (int16_t)((left + right) / 2);
                }
                i2s_write(I2S_NUM, converted, frames * 2, &bytesWritten, portMAX_DELAY);
                bytesPlayed += initialBytes;
            } else if (wavHeader.bitsPerSample == 16 && wavHeader.numChannels == 1) {
                int samples = initialBytes / 2;
                int16_t* buf = (int16_t*)audioBuffer;
                for (int i = samples - 1; i >= 0; i--) {
                    buf[i*2] = buf[i];
                    buf[i*2+1] = buf[i];
                }
                i2s_write(I2S_NUM, audioBuffer, samples * 4, &bytesWritten, portMAX_DELAY);
                bytesPlayed += initialBytes;
            } else if (wavHeader.bitsPerSample == 8 && wavHeader.numChannels == 1) {
                int samples = initialBytes;
                int16_t* converted = (int16_t*)audioBuffer;
                for (int i = samples - 1; i >= 0; i--) {
                    int16_t val = ((int16_t)audioBuffer[i] - 128) * 256;
                    converted[i*2] = val;
                    converted[i*2+1] = val;
                }
                i2s_write(I2S_NUM, converted, samples * 4, &bytesWritten, portMAX_DELAY);
                bytesPlayed += initialBytes;
            }

        }

        int bytesRead;
        int i2sWriteSize = 4096;

        while ((bytesRead = readAudioChunk(handle, audioBuffer, chunkSize)) > 0) {
            size_t bytesWritten;
            int writeOffset = 0;

            if (wavHeader.bitsPerSample == 8) {
                int samples = bytesRead;
                int16_t* converted = (int16_t*)audioBuffer;
                if (wavHeader.numChannels == 1) {
                    for (int i = samples - 1; i >= 0; i--) {
                        int16_t val = ((int16_t)audioBuffer[i] - 128) * 256;
                        converted[i*2] = val;
                        converted[i*2+1] = val;
                    }
                    int totalToWrite = samples * 4;
                    while (writeOffset < totalToWrite) {
                        int toWrite = (totalToWrite - writeOffset < i2sWriteSize) ? (totalToWrite - writeOffset) : i2sWriteSize;
                        i2s_write(I2S_NUM, (uint8_t*)converted + writeOffset, toWrite, &bytesWritten, portMAX_DELAY);
                        writeOffset += bytesWritten;
                    }
                } else {
                    for (int i = samples - 1; i >= 0; i--) {
                        converted[i] = ((int16_t)audioBuffer[i] - 128) * 256;
                    }
                    int totalToWrite = samples * 2;
                    while (writeOffset < totalToWrite) {
                        int toWrite = (totalToWrite - writeOffset < i2sWriteSize) ? (totalToWrite - writeOffset) : i2sWriteSize;
                        i2s_write(I2S_NUM, (uint8_t*)converted + writeOffset, toWrite, &bytesWritten, portMAX_DELAY);
                        writeOffset += bytesWritten;
                    }
                }
            }
            else if (wavHeader.bitsPerSample == 16) {
                if (wavHeader.numChannels == 2) {
                    while (writeOffset < bytesRead) {
                        int toWrite = (bytesRead - writeOffset < i2sWriteSize) ? (bytesRead - writeOffset) : i2sWriteSize;
                        i2s_write(I2S_NUM, audioBuffer + writeOffset, toWrite, &bytesWritten, portMAX_DELAY);
                        writeOffset += bytesWritten;
                    }
                } else {
                    int samples = bytesRead / 2;
                    int16_t* src = (int16_t*)audioBuffer;
                    int16_t* dst = (int16_t*)audioBuffer;
                    for (int i = samples - 1; i >= 0; i--) {
                        dst[i*2] = src[i];
                        dst[i*2+1] = src[i];
                    }
                    int totalToWrite = samples * 4;
                    while (writeOffset < totalToWrite) {
                        int toWrite = (totalToWrite - writeOffset < i2sWriteSize) ? (totalToWrite - writeOffset) : i2sWriteSize;
                        i2s_write(I2S_NUM, audioBuffer + writeOffset, toWrite, &bytesWritten, portMAX_DELAY);
                        writeOffset += bytesWritten;
                    }
                }
            }
            else if (wavHeader.bitsPerSample == 24) {
                int16_t* converted = (int16_t*)audioBuffer;
                int totalToWrite;
                if (wavHeader.numChannels == 2) {
                    int frames = bytesRead / 6;
                    for (int i = 0; i < frames; i++) {
                        int32_t left = audioBuffer[i*6] | (audioBuffer[i*6+1] << 8);
                        int32_t right = audioBuffer[i*6+3] | (audioBuffer[i*6+4] << 8);
                        converted[i] = (int16_t)((left + right) / 2);
                    }
                    totalToWrite = frames * 2;
                } else {
                    int samples = bytesRead / 3;
                    for (int i = 0; i < samples; i++) {
                        converted[i] = (int16_t)(audioBuffer[i*3] | (audioBuffer[i*3+1] << 8));
                    }
                    totalToWrite = samples * 2;
                }
                while (writeOffset < totalToWrite) {
                    int toWrite = (totalToWrite - writeOffset < i2sWriteSize) ? (totalToWrite - writeOffset) : i2sWriteSize;
                    i2s_write(I2S_NUM, (uint8_t*)converted + writeOffset, toWrite, &bytesWritten, portMAX_DELAY);
                    writeOffset += bytesWritten;
                }
            }

            bytesPlayed += bytesRead;
            progressCounter++;

            if (progressCounter % 50 == 0 && wavHeader.dataSize > 0) {
                int percent = (bytesPlayed * 100) / wavHeader.dataSize;
                writeToOled("Playing...\n%d%%\n%s", percent, filename);
            }
        }


        delay((I2S_DMA_BUF_COUNT * I2S_DMA_BUF_LEN * 1000) / (wavHeader.sampleRate * 4) + 50);
        i2s_zero_dma_buffer(I2S_NUM);

        free(audioBuffer);
        free(headerBuffer);
        i2s_set_sample_rates(I2S_NUM, I2S_SAMPLE_RATE);
    }

    closeAudioFile(handle);
    writeToOled("Playback\ndone!");
    delay(1000);
    clearOled();
    stopAudio();
}
