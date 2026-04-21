// Made for playground_master
#include "max98357a.h"
#include "oled.h"
#include "sdcard.h"
#include <driver/i2s.h>
#include <string.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/queue.h>

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

typedef struct {
    int frequency;
    int duration;
    char filename[64];
    bool isFile;
} AudioCommand;

static TaskHandle_t audioTaskHandle = NULL;
static QueueHandle_t audioQueue = NULL;
static volatile bool stopRequested = false;
static volatile bool isCurrentlyPlaying = false;

static void initI2S() {
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

static bool checkStop() {
    return stopRequested;
}

static void playToneBlocking(int frequency, int duration) {
    const int sampleRate = I2S_SAMPLE_RATE;
    const int samplesPerCycle = sampleRate / frequency;
    const int totalSamples = (sampleRate * duration) / 1000;
    const int chunkSize = 4096;

    int16_t *samples = (int16_t*)malloc(chunkSize * sizeof(int16_t));
    if (samples == NULL) return;

    int samplesGenerated = 0;
    while (samplesGenerated < totalSamples && !checkStop()) {
        int samplesToWrite = (totalSamples - samplesGenerated < chunkSize) ? 
                             (totalSamples - samplesGenerated) : chunkSize;

        for (int i = 0; i < samplesToWrite; i++) {
            float t = (float)(samplesGenerated + i) / sampleRate;
            float value = sin(2.0 * PI * frequency * t);
            samples[i] = (int16_t)(value * 32767 * 0.5);
        }

        size_t bytesWritten;
        i2s_write(I2S_NUM, samples, samplesToWrite * sizeof(int16_t), &bytesWritten, portMAX_DELAY);
        samplesGenerated += samplesToWrite;
    }

    free(samples);
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

static void playAudioFileBlocking(const char* filename) {
    int handle = openAudioFile(filename);
    if (handle < 0) {
        writeToOled("File not found:\n%s", filename);
        return;
    }

    uint8_t* headerBuffer = (uint8_t*)malloc(2048);
    if (headerBuffer == NULL) {
        closeAudioFile(handle);
        return;
    }
    int headerRead = readAudioChunk(handle, headerBuffer, 2048);

    if (headerRead < 44) {
        free(headerBuffer);
        closeAudioFile(handle);
        return;
    }

    WavHeader wavHeader;
    if (!parseWavHeader(headerBuffer, headerRead, &wavHeader)) {
        free(headerBuffer);
        closeAudioFile(handle);
        return;
    }

    i2s_set_sample_rates(I2S_NUM, wavHeader.sampleRate);

    int chunkSize = 16384;
    int bufferSize = 65536;
    uint8_t* audioBuffer = (uint8_t*)malloc(bufferSize);
    if (audioBuffer == NULL) {
        free(headerBuffer);
        closeAudioFile(handle);
        return;
    }

    if (headerRead > (int)wavHeader.dataOffset) {
        int initialBytes = headerRead - wavHeader.dataOffset;
        memcpy(audioBuffer, headerBuffer + wavHeader.dataOffset, initialBytes);

        size_t bytesWritten = 0;
        if (wavHeader.bitsPerSample == 16 && wavHeader.numChannels == 2) {
            i2s_write(I2S_NUM, audioBuffer, initialBytes, &bytesWritten, portMAX_DELAY);
        } else if (wavHeader.bitsPerSample == 24 && wavHeader.numChannels == 2) {
            int frames = initialBytes / 6;
            int16_t* converted = (int16_t*)audioBuffer;
            for (int i = 0; i < frames; i++) {
                int32_t left = audioBuffer[i*6] | (audioBuffer[i*6+1] << 8);
                int32_t right = audioBuffer[i*6+3] | (audioBuffer[i*6+4] << 8);
                converted[i] = (int16_t)((left + right) / 2);
            }
            i2s_write(I2S_NUM, converted, frames * 2, &bytesWritten, portMAX_DELAY);
        } else if (wavHeader.bitsPerSample == 16 && wavHeader.numChannels == 1) {
            int samples = initialBytes / 2;
            int16_t* buf = (int16_t*)audioBuffer;
            for (int i = samples - 1; i >= 0; i--) {
                buf[i*2] = buf[i];
                buf[i*2+1] = buf[i];
            }
            i2s_write(I2S_NUM, audioBuffer, samples * 4, &bytesWritten, portMAX_DELAY);
        } else if (wavHeader.bitsPerSample == 8 && wavHeader.numChannels == 1) {
            int samples = initialBytes;
            int16_t* converted = (int16_t*)audioBuffer;
            for (int i = samples - 1; i >= 0; i--) {
                int16_t val = ((int16_t)audioBuffer[i] - 128) * 256;
                converted[i*2] = val;
                converted[i*2+1] = val;
            }
            i2s_write(I2S_NUM, converted, samples * 4, &bytesWritten, portMAX_DELAY);
        }
    }

    int bytesRead;
    int i2sWriteSize = 4096;

    while ((bytesRead = readAudioChunk(handle, audioBuffer, chunkSize)) > 0 && !checkStop()) {
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
                while (writeOffset < totalToWrite && !checkStop()) {
                    int toWrite = (totalToWrite - writeOffset < i2sWriteSize) ? (totalToWrite - writeOffset) : i2sWriteSize;
                    i2s_write(I2S_NUM, (uint8_t*)converted + writeOffset, toWrite, &bytesWritten, portMAX_DELAY);
                    writeOffset += bytesWritten;
                }
            } else {
                for (int i = samples - 1; i >= 0; i--) {
                    converted[i] = ((int16_t)audioBuffer[i] - 128) * 256;
                }
                int totalToWrite = samples * 2;
                while (writeOffset < totalToWrite && !checkStop()) {
                    int toWrite = (totalToWrite - writeOffset < i2sWriteSize) ? (totalToWrite - writeOffset) : i2sWriteSize;
                    i2s_write(I2S_NUM, (uint8_t*)converted + writeOffset, toWrite, &bytesWritten, portMAX_DELAY);
                    writeOffset += bytesWritten;
                }
            }
        }
        else if (wavHeader.bitsPerSample == 16) {
            if (wavHeader.numChannels == 2) {
                while (writeOffset < bytesRead && !checkStop()) {
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
                while (writeOffset < totalToWrite && !checkStop()) {
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
            while (writeOffset < totalToWrite && !checkStop()) {
                int toWrite = (totalToWrite - writeOffset < i2sWriteSize) ? (totalToWrite - writeOffset) : i2sWriteSize;
                i2s_write(I2S_NUM, (uint8_t*)converted + writeOffset, toWrite, &bytesWritten, portMAX_DELAY);
                writeOffset += bytesWritten;
            }
        }
    }

    if (!checkStop()) {
        delay((I2S_DMA_BUF_COUNT * I2S_DMA_BUF_LEN * 1000) / (wavHeader.sampleRate * 4) + 50);
    }
    i2s_zero_dma_buffer(I2S_NUM);

    free(audioBuffer);
    free(headerBuffer);
    i2s_set_sample_rates(I2S_NUM, I2S_SAMPLE_RATE);
    closeAudioFile(handle);
}

static void audioTask(void* parameter) {
    AudioCommand cmd;
    
    while (1) {
        if (xQueueReceive(audioQueue, &cmd, portMAX_DELAY) == pdTRUE) {
            if (stopRequested) {
                continue;
            }
            
            isCurrentlyPlaying = true;
            
            if (cmd.isFile) {
                writeToOled("Playing:\n%s", cmd.filename);
                playAudioFileBlocking(cmd.filename);
            } else {
                writeToOled("Tone: %dHz\n%dms", cmd.frequency, cmd.duration);
                playToneBlocking(cmd.frequency, cmd.duration);
            }
            
            isCurrentlyPlaying = false;
            stopRequested = false;
            
            if (!cmd.isFile || !stopRequested) {
                clearOled();
            }
        }
    }
}

void initMAX98357A() {
    initI2S();
    
    if (audioQueue == NULL) {
        audioQueue = xQueueCreate(1, sizeof(AudioCommand));
    }
    
    if (audioTaskHandle == NULL) {
        xTaskCreate(audioTask, "AudioTask", 16384, NULL, 1, &audioTaskHandle);
    }
}

void playTone(int frequency, int duration) {
    if (!i2sInitialized) {
        initMAX98357A();
    }
    
    stopRequested = true;
    while (isCurrentlyPlaying) {
        vTaskDelay(1);
    }
    stopRequested = false;
    
    AudioCommand cmd;
    cmd.frequency = frequency;
    cmd.duration = duration;
    cmd.isFile = false;
    cmd.filename[0] = '\0';
    
    xQueueOverwrite(audioQueue, &cmd);
}

void playAudioFile(const char* filename) {
    if (!i2sInitialized) {
        initMAX98357A();
    }
    
    stopRequested = true;
    while (isCurrentlyPlaying) {
        vTaskDelay(1);
    }
    stopRequested = false;
    
    AudioCommand cmd;
    cmd.frequency = 0;
    cmd.duration = 0;
    cmd.isFile = true;
    strncpy(cmd.filename, filename, sizeof(cmd.filename) - 1);
    cmd.filename[sizeof(cmd.filename) - 1] = '\0';
    
    xQueueOverwrite(audioQueue, &cmd);
}

void stopAudio() {
    stopRequested = true;
    i2s_zero_dma_buffer(I2S_NUM);
    
    int timeout = 100;
    while (isCurrentlyPlaying && timeout > 0) {
        vTaskDelay(1);
        timeout--;
    }
    
    clearOled();
}

bool isPlaying() {
    return isCurrentlyPlaying;
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
        while (isPlaying()) {
            delay(100);
        }
    } else {
        writeToOled("Test: Triad");
        playTone(262, 500);
        while (isPlaying()) delay(10);
        playTone(330, 500);
        while (isPlaying()) delay(10);
        playTone(392, 500);
        while (isPlaying()) delay(10);
        playTone(523, 500);
        while (isPlaying()) delay(10);
    }

    stopAudio();
}
