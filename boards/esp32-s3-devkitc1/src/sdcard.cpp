#include "sdcard.h"
#include "oled.h"
#include <SPI.h>
#include <SD.h>

#define SDCARD_DEBUG 0

#if SDCARD_DEBUG
  #define DBG_PRINT(x) Serial.print(x)
  #define DBG_PRINTF(...) Serial.printf(__VA_ARGS__)
  #define DBG_PRINTLN(x) Serial.println(x)
#else
  #define DBG_PRINT(x)
  #define DBG_PRINTF(...)
  #define DBG_PRINTLN(x)
#endif

static bool sdInitialized = false;
static bool useManualMode = false;
static bool isSDHC = false;

#define MAX_AUDIO_FILES 4

typedef struct {
  bool inUse;
  uint32_t startCluster;
  uint32_t fileSize;
  uint32_t currentCluster;
  uint32_t bytesRead;
  uint32_t sectorInCluster;
} AudioFileHandle;

static AudioFileHandle audioFiles[MAX_AUDIO_FILES];

static bool setFatEntry(uint32_t cluster, uint32_t value);

static uint8_t crc7(const uint8_t* data, int len) {
  uint8_t crc = 0;
  for (int i = 0; i < len; i++) {
    uint8_t d = data[i];
    for (int j = 0; j < 8; j++) {
      crc <<= 1;
      if ((d ^ crc) & 0x80) crc ^= 0x09;
      d <<= 1;
    }
  }
  return (crc << 1) | 1;
}

static uint32_t fatStartSector = 0;
static uint32_t rootDirSector = 0;
static uint32_t dataStartSector = 0;
static uint32_t sectorsPerCluster = 0;
static uint32_t bytesPerSector = 512;
static uint32_t fatSize = 0;
static bool isFat32 = false;

static uint8_t sendCommand(uint8_t cmd, uint32_t arg) {
  SPI.transfer(0xFF);
  SPI.transfer(cmd | 0x40);
  SPI.transfer((arg >> 24) & 0xFF);
  SPI.transfer((arg >> 16) & 0xFF);
  SPI.transfer((arg >> 8) & 0xFF);
  SPI.transfer(arg & 0xFF);
  SPI.transfer(0x55);
  
  uint8_t r1 = 0xFF;
  for (int i = 0; i < 20; i++) {
    r1 = SPI.transfer(0xFF);
    if (r1 != 0xFF) break;
  }
  return r1;
}

static bool readSector(uint32_t sector, uint8_t* buffer) {
  uint32_t address = isSDHC ? sector : (sector * 512);
  
  uint8_t cmdFrame[5] = {
    0x51,
    (uint8_t)((address >> 24) & 0xFF),
    (uint8_t)((address >> 16) & 0xFF),
    (uint8_t)((address >> 8) & 0xFF),
    (uint8_t)(address & 0xFF)
  };
  uint8_t crc = crc7(cmdFrame, 5);
  DBG_PRINTF("CMD17 addr=%lu, CRC=0x%02X\n", address, crc);
  
  digitalWrite(SD_CS_PIN, HIGH);
  for (int i = 0; i < 10; i++) SPI.transfer(0xFF);
  digitalWrite(SD_CS_PIN, LOW);
  SPI.transfer(0xFF);
  SPI.transfer(cmdFrame[0]);
  SPI.transfer(cmdFrame[1]);
  SPI.transfer(cmdFrame[2]);
  SPI.transfer(cmdFrame[3]);
  SPI.transfer(cmdFrame[4]);
  SPI.transfer(crc);
  
  uint8_t r1 = 0xFF;
  for (int i = 0; i < 20; i++) {
    r1 = SPI.transfer(0xFF);
    if (r1 != 0xFF) break;
  }
  
  if (r1 != 0x00) {
    DBG_PRINTF("CMD17 failed for sector %lu (addr %lu), response: 0x%02X\n", sector, address, r1);
    digitalWrite(SD_CS_PIN, HIGH);
    return false;
  }
  
  uint8_t token = 0xFF;
  for (int i = 0; i < 100000; i++) {
    token = SPI.transfer(0xFF);
    if (token != 0xFF) break;
  }
  
  if (token == 0x00) {
    for (int i = 0; i < 100000; i++) {
      token = SPI.transfer(0xFF);
      if (token == 0xFE) break;
    }
  }
  
  if (token != 0xFE) {
    DBG_PRINTF("No data token for sector %lu, got: 0x%02X\n", sector, token);
    digitalWrite(SD_CS_PIN, HIGH);
    return false;
  }
  
  for (int i = 0; i < 512; i++) {
    buffer[i] = SPI.transfer(0xFF);
  }
  SPI.transfer(0xFF);
  SPI.transfer(0xFF);
  digitalWrite(SD_CS_PIN, HIGH);
  
  return true;
}

static uint16_t crc16(const uint8_t* data, int len) {
  uint16_t crc = 0;
  for (int i = 0; i < len; i++) {
    crc ^= (uint16_t)data[i] << 8;
    for (int j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
    }
  }
  return crc;
}

static bool writeSectorRaw(uint32_t sector, const uint8_t* buffer) {
  uint32_t address = isSDHC ? sector : (sector * 512);
  
  uint8_t cmdFrame[5] = {
    0x58,
    (uint8_t)((address >> 24) & 0xFF),
    (uint8_t)((address >> 16) & 0xFF),
    (uint8_t)((address >> 8) & 0xFF),
    (uint8_t)(address & 0xFF)
  };
  uint8_t crc = crc7(cmdFrame, 5);
  
  digitalWrite(SD_CS_PIN, HIGH);
  for (int i = 0; i < 10; i++) SPI.transfer(0xFF);
  digitalWrite(SD_CS_PIN, LOW);
  SPI.transfer(0xFF);
  SPI.transfer(cmdFrame[0]);
  SPI.transfer(cmdFrame[1]);
  SPI.transfer(cmdFrame[2]);
  SPI.transfer(cmdFrame[3]);
  SPI.transfer(cmdFrame[4]);
  SPI.transfer(crc);
  
  uint8_t r1 = 0xFF;
  for (int i = 0; i < 20; i++) {
    r1 = SPI.transfer(0xFF);
    if (r1 != 0xFF) break;
  }
  
  if (r1 != 0x00) {
    DBG_PRINTF("CMD24 failed for sector %lu, response: 0x%02X\n", sector, r1);
    digitalWrite(SD_CS_PIN, HIGH);
    return false;
  }
  
  for (int i = 0; i < 10; i++) SPI.transfer(0xFF);
  
  SPI.transfer(0xFE);
  
  for (int i = 0; i < 512; i++) {
    SPI.transfer(buffer[i]);
  }
  
  uint16_t dataCrc = crc16(buffer, 512);
  SPI.transfer((dataCrc >> 8) & 0xFF);
  SPI.transfer(dataCrc & 0xFF);
  
  uint8_t response = 0xFF;
  for (int i = 0; i < 20; i++) {
    response = SPI.transfer(0xFF);
    if (response != 0xFF) break;
  }
  
  digitalWrite(SD_CS_PIN, HIGH);
  for (int i = 0; i < 20; i++) SPI.transfer(0xFF);
  delay(1);
  
  if ((response & 0x1F) != 0x05) {
    DBG_PRINTF("Write failed, response: 0x%02X\n", response);
    return false;
  }
  
  for (int i = 0; i < 100; i++) SPI.transfer(0xFF);
  delay(10);
  
  return true;
}

static bool writeSector(uint32_t sector, const uint8_t* buffer) {
  return writeSectorRaw(sector, buffer);
}

static bool initFatFS() {
  uint8_t buffer[512];
  
  DBG_PRINTLN("Testing sector reads...");
  
  for (uint32_t sec = 0; sec <= 10; sec++) {
    if (readSector(sec, buffer)) {
      DBG_PRINTF("Sector %lu: OK\n", sec);
    } else {
      DBG_PRINTF("Sector %lu: FAILED\n", sec);
      break;
    }
  }
  
  if (!readSector(0, buffer)) {
    DBG_PRINTLN("Failed to read MBR");
    return false;
  }
  
  DBG_PRINTLN("MBR read OK, checking partition table...");
  DBG_PRINTF("MBR signature: %02X %02X\n", buffer[510], buffer[511]);
  
  uint32_t partitionStart = 0;
  if (buffer[510] == 0x55 && buffer[511] == 0xAA) {
    partitionStart = *(uint32_t*)(buffer + 454);
    DBG_PRINTF("Partition 1 start: %lu (LBA)\n", partitionStart);
    DBG_PRINTF("Partition 1 type: %02X\n", buffer[450]);
  }
  
  if (partitionStart == 0) {
    DBG_PRINTLN("No partition found, trying as superfloppy");
    partitionStart = 0;
  }
  
  delay(100);
  
  DBG_PRINTF("Reading boot sector at %lu...\n", partitionStart);
  if (!readSector(partitionStart, buffer)) {
    DBG_PRINTLN("Failed to read boot sector");
    
    for (int retry = 0; retry < 5; retry++) {
      delay(100);
      DBG_PRINTF("Retry %d...\n", retry + 1);
      if (readSector(partitionStart, buffer)) {
        DBG_PRINTLN("Success on retry!");
        break;
      }
    }
    if (!readSector(partitionStart, buffer)) {
      return false;
    }
  }
  
  DBG_PRINTLN("Boot sector read OK");
  DBG_PRINTF("First 32 bytes: ");
  for (int i = 0; i < 32; i++) {
    DBG_PRINTF("%02X ", buffer[i]);
  }
  DBG_PRINTLN();
  DBG_PRINTF("Jump instruction: %02X %02X %02X\n", buffer[0], buffer[1], buffer[2]);
  
  bytesPerSector = *(uint16_t*)(buffer + 11);
  sectorsPerCluster = buffer[13];
  uint16_t reservedSectors = *(uint16_t*)(buffer + 14);
  uint8_t numFATs = buffer[16];
  uint16_t rootEntryCount = *(uint16_t*)(buffer + 17);
  uint32_t fatSize16 = *(uint16_t*)(buffer + 22);
  uint32_t fatSize32 = *(uint32_t*)(buffer + 36);
  uint32_t rootCluster = *(uint32_t*)(buffer + 44);
  
  DBG_PRINTF("Bytes per sector: %d\n", bytesPerSector);
  DBG_PRINTF("Sectors per cluster: %d\n", sectorsPerCluster);
  DBG_PRINTF("Reserved sectors: %d\n", reservedSectors);
  DBG_PRINTF("Number of FATs: %d\n", numFATs);
  
  fatSize = fatSize16 ? fatSize16 : fatSize32;
  isFat32 = (fatSize16 == 0);
  
  fatStartSector = partitionStart + reservedSectors;
  dataStartSector = partitionStart + reservedSectors + (numFATs * fatSize);
  
  if (isFat32) {
    rootDirSector = dataStartSector + ((rootCluster - 2) * sectorsPerCluster);
    DBG_PRINTF("Root cluster: %lu\n", rootCluster);
  } else {
    rootDirSector = fatStartSector + (numFATs * fatSize);
    dataStartSector = rootDirSector + ((rootEntryCount * 32 + bytesPerSector - 1) / bytesPerSector);
  }
  
  DBG_PRINTF("FAT%s detected\n", isFat32 ? "32" : "16");
  DBG_PRINTF("FAT start: %lu\n", fatStartSector);
  DBG_PRINTF("Root dir sector: %lu\n", rootDirSector);
  DBG_PRINTF("Data start: %lu\n", dataStartSector);
  
  return true;
}

static uint32_t getNextCluster(uint32_t cluster) {
  uint8_t buffer[512];
  uint32_t fatOffset;
  
  if (isFat32) {
    fatOffset = cluster * 4;
  } else {
    fatOffset = cluster * 2;
  }
  
  uint32_t fatSector = fatStartSector + (fatOffset / bytesPerSector);
  uint32_t offsetInSector = fatOffset % bytesPerSector;
  
  if (!readSector(fatSector, buffer)) {
    return 0x0FFFFFF8;
  }
  
  if (isFat32) {
    return (*(uint32_t*)(buffer + offsetInSector)) & 0x0FFFFFFF;
  } else {
    return *(uint16_t*)(buffer + offsetInSector);
  }
}

static uint32_t clusterToSector(uint32_t cluster) {
  return dataStartSector + ((cluster - 2) * sectorsPerCluster);
}

static bool compareFilename(const uint8_t* entry, const char* filename) {
  char name[12];
  memset(name, ' ', 11);
  name[11] = 0;
  
  int i = 0, j = 0;
  while (filename[i] && j < 11) {
    if (filename[i] == '.') {
      j = 8;
      i++;
    } else {
      name[j++] = toupper(filename[i++]);
    }
  }
  
  for (int k = 0; k < 11; k++) {
    if (entry[k] != name[k]) return false;
  }
  return true;
}

static int32_t findFile(const char* filename, uint32_t* fileSize, uint32_t* startCluster) {
  uint8_t buffer[512];
  uint32_t entriesPerSector = bytesPerSector / 32;
  uint32_t sector = rootDirSector;
  uint32_t maxSectors = isFat32 ? (sectorsPerCluster * 16) : (dataStartSector - rootDirSector);
  
  DBG_PRINTF("findFile: rootDirSector=%lu, maxSectors=%lu\n", sector, maxSectors);
  
  for (uint32_t s = 0; s < maxSectors; s++) {
    if (!readSector(sector + (s % sectorsPerCluster), buffer)) break;
    
    for (uint32_t e = 0; e < entriesPerSector; e++) {
      uint8_t* entry = buffer + (e * 32);
      
      if (entry[0] == 0x00) return -1;
      if (entry[0] == 0xE5) continue;
      if (entry[11] == 0x0F) continue;
      if (entry[11] & 0x08) continue;
      
      if (compareFilename(entry, filename)) {
        *startCluster = entry[26] | (entry[27] << 8);
        if (isFat32) {
          *startCluster |= (entry[20] << 16) | (entry[21] << 24);
        }
        *fileSize = *(uint32_t*)(entry + 28);
        return s * entriesPerSector + e;
      }
    }
    
    if (isFat32 && (s + 1) % sectorsPerCluster == 0) {
      uint32_t currentCluster = 2 + (sector - dataStartSector) / sectorsPerCluster;
      uint32_t nextCluster = getNextCluster(currentCluster);
      if (nextCluster >= 0x0FFFFFF8) break;
      sector = clusterToSector(nextCluster);
      s = 0;
    }
  }
  
  return -1;
}

String readFileFromCard(const char* filename) {
  if (!sdInitialized) return "";
  
  if (fatStartSector == 0) {
    if (!initFatFS()) {
      return "FAT init failed";
    }
  }
  
  uint32_t fileSize, startCluster;
  int32_t found = findFile(filename, &fileSize, &startCluster);
  
  if (found < 0) {
    return "File not found";
  }
  
  DBG_PRINTF("File: %s, Size: %lu, Cluster: %lu\n", filename, fileSize, startCluster);
  
  String content = "";
  uint8_t buffer[512];
  uint32_t cluster = startCluster;
  uint32_t bytesRead = 0;
  
  while (cluster >= 2 && cluster < 0x0FFFFFF8 && bytesRead < fileSize) {
    uint32_t sector = clusterToSector(cluster);
    
    for (uint32_t s = 0; s < sectorsPerCluster && bytesRead < fileSize; s++) {
      if (!readSector(sector + s, buffer)) break;
      
      uint32_t toRead = min((uint32_t)512, fileSize - bytesRead);
      for (uint32_t i = 0; i < toRead; i++) {
        content += (char)buffer[i];
      }
      bytesRead += toRead;
    }
    
    cluster = getNextCluster(cluster);
  }
  
  return content;
}

bool deleteFileFromCard(const char* filename) {
  if (!sdInitialized) {
    DBG_PRINTLN("SD not initialized");
    return false;
  }
  
  if (fatStartSector == 0) {
    if (!initFatFS()) {
      DBG_PRINTLN("FAT init failed");
      return false;
    }
  }
  
  uint32_t fileSize, startCluster;
  int32_t found = findFile(filename, &fileSize, &startCluster);
  
  if (found < 0) {
    DBG_PRINTF("File not found: %s\n", filename);
    return false;
  }
  
  uint32_t cluster = startCluster;
  while (cluster >= 2 && cluster < 0x0FFFFFF8) {
    uint32_t nextCluster = getNextCluster(cluster);
    setFatEntry(cluster, 0);
    cluster = nextCluster;
  }
  
  uint8_t buffer[512];
  uint32_t entriesPerSector = bytesPerSector / 32;
  uint32_t dirSector = rootDirSector;
  uint32_t maxSectors = isFat32 ? (sectorsPerCluster * 16) : (dataStartSector - rootDirSector);
  bool deleted = false;
  
  for (uint32_t s = 0; s < maxSectors; s++) {
    if (!readSector(dirSector + (s % sectorsPerCluster), buffer)) break;
    bool modified = false;
    
    for (uint32_t e = 0; e < entriesPerSector; e++) {
      uint8_t* entry = buffer + (e * 32);
      
      if (entry[0] == 0x00) break;
      if (entry[0] == 0xE5) continue;
      if (entry[11] == 0x0F) continue;
      if (entry[11] & 0x08) continue;
      
      if (compareFilename(entry, filename)) {
        entry[0] = 0xE5;
        modified = true;
        deleted = true;
      }
    }
    
    if (modified) {
      if (!writeSectorRaw(dirSector + (s % sectorsPerCluster), buffer)) {
        DBG_PRINTLN("Failed to mark directory entry as deleted");
        return false;
      }
    }
    
    if (isFat32 && (s + 1) % sectorsPerCluster == 0) {
      uint32_t currentDirCluster = 2 + (dirSector - dataStartSector) / sectorsPerCluster;
      uint32_t nextDirCluster = getNextCluster(currentDirCluster);
      if (nextDirCluster >= 0x0FFFFFF8) break;
      dirSector = clusterToSector(nextDirCluster);
      s = 0;
    }
  }
  
  if (deleted) {
    DBG_PRINTF("File deleted: %s\n", filename);
    return true;
  }
  
  DBG_PRINTF("File not found: %s\n", filename);
  return false;
}

void listFilesFromCard() {
  if (!sdInitialized) {
    DBG_PRINTLN("SD not initialized");
    return;
  }
  
  if (fatStartSector == 0) {
    if (!initFatFS()) {
      DBG_PRINTLN("FAT init failed");
      return;
    }
  }
  
  uint8_t buffer[512];
  uint32_t entriesPerSector = bytesPerSector / 32;
  uint32_t sector = rootDirSector;
  uint32_t maxSectors = isFat32 ? (sectorsPerCluster * 16) : (dataStartSector - rootDirSector);
  
  DBG_PRINTLN("\n=== Directory Listing ===");
  
  for (uint32_t s = 0; s < maxSectors; s++) {
    if (!readSector(sector + (s % sectorsPerCluster), buffer)) break;
    
    for (uint32_t e = 0; e < entriesPerSector; e++) {
      uint8_t* entry = buffer + (e * 32);
      
      if (entry[0] == 0x00) {
        DBG_PRINTLN("=========================");
        return;
      }
      if (entry[0] == 0xE5) continue;
      if (entry[11] == 0x0F) continue;
      if (entry[11] & 0x08) continue;
      
      char name[13];
      memset(name, 0, 13);
      int j = 0;
      for (int i = 0; i < 8 && entry[i] != ' '; i++) {
        name[j++] = entry[i];
      }
      if (entry[8] != ' ') {
        name[j++] = '.';
        for (int i = 8; i < 11 && entry[i] != ' '; i++) {
          name[j++] = entry[i];
        }
      }
      name[j] = '\0';
      
      uint32_t fileSize = *(uint32_t*)(entry + 28);
      uint8_t attr = entry[11];
      
      if (attr & 0x10) {
        DBG_PRINTF("[DIR]  %s\n", name);
      } else {
        DBG_PRINTF("[FILE] %s  (%lu bytes)\n", name, fileSize);
      }
    }
    
    if (isFat32 && (s + 1) % sectorsPerCluster == 0) {
      uint32_t currentCluster = 2 + (sector - dataStartSector) / sectorsPerCluster;
      uint32_t nextCluster = getNextCluster(currentCluster);
      if (nextCluster >= 0x0FFFFFF8) break;
      sector = clusterToSector(nextCluster);
      s = 0;
    }
  }
  
  DBG_PRINTLN("=========================");
}

static uint32_t findFreeCluster() {
  uint8_t buffer[512];
  uint32_t fatSectors = fatSize;
  
  for (uint32_t s = 0; s < fatSectors; s++) {
    if (!readSector(fatStartSector + s, buffer)) break;
    
    for (uint32_t i = 0; i < bytesPerSector; i += (isFat32 ? 4 : 2)) {
      uint32_t entry;
      if (isFat32) {
        entry = (*(uint32_t*)(buffer + i)) & 0x0FFFFFFF;
      } else {
        entry = *(uint16_t*)(buffer + i);
      }
      if (entry == 0) {
        uint32_t cluster = s * (bytesPerSector / (isFat32 ? 4 : 2)) + i / (isFat32 ? 4 : 2);
        return cluster;
      }
    }
  }
  return 0;
}

static bool setFatEntry(uint32_t cluster, uint32_t value) {
  uint8_t buffer[512];
  uint32_t fatOffset = isFat32 ? (cluster * 4) : (cluster * 2);
  uint32_t fatSector = fatStartSector + (fatOffset / bytesPerSector);
  uint32_t offsetInSector = fatOffset % bytesPerSector;
  
  if (!readSector(fatSector, buffer)) return false;
  
  if (isFat32) {
    *(uint32_t*)(buffer + offsetInSector) = value & 0x0FFFFFFF;
  } else {
    *(uint16_t*)(buffer + offsetInSector) = value & 0xFFFF;
  }
  
  if (!writeSectorRaw(fatSector, buffer)) return false;
  
  return true;
}

bool writeFileToCard(const char* filename, const char* content, bool append) {
  if (!sdInitialized) {
    DBG_PRINTLN("SD not initialized");
    return false;
  }
  
  if (fatStartSector == 0) {
    if (!initFatFS()) {
      DBG_PRINTLN("FAT init failed");
      return false;
    }
  }
  
  uint32_t contentLen = strlen(content);
  uint32_t firstCluster = 0;
  uint32_t existingSize = 0;
  uint32_t lastCluster = 0;
  uint32_t bytesWritten = 0;
  uint8_t buffer[512];
  
  if (append) {
    uint32_t fileSize, startCluster;
    if (findFile(filename, &fileSize, &startCluster) >= 0) {
      firstCluster = startCluster;
      existingSize = fileSize;
      
      lastCluster = startCluster;
      uint32_t nextCluster = startCluster;
      while (nextCluster >= 2 && nextCluster < 0x0FFFFFF8) {
        lastCluster = nextCluster;
        nextCluster = getNextCluster(nextCluster);
      }
      
      DBG_PRINTF("Appending to existing file, cluster %lu, size %lu\n", firstCluster, existingSize);
    } else {
      DBG_PRINTLN("File not found, creating new");
      append = false;
    }
  }
  
  if (!append) {
    firstCluster = findFreeCluster();
    if (firstCluster == 0) {
      DBG_PRINTLN("No free cluster");
      return false;
    }
    lastCluster = firstCluster;
    
    DBG_PRINTF("Allocating cluster %lu for %lu bytes\n", firstCluster, contentLen);
    
    if (!setFatEntry(firstCluster, 0x0FFFFFFF)) {
      DBG_PRINTLN("Failed to set FAT entry");
      return false;
    }
  }
  
  if (append && existingSize > 0) {
    uint32_t lastSectorOffset = existingSize % bytesPerSector;
    if (lastSectorOffset > 0) {
      uint32_t lastSector = clusterToSector(lastCluster);
      for (uint32_t s = 0; s < sectorsPerCluster; s++) {
        uint32_t sectorOffset = existingSize - (existingSize % (sectorsPerCluster * bytesPerSector));
        if (sectorOffset + (s + 1) * bytesPerSector <= existingSize) continue;
        
        uint32_t sector = lastSector + s;
        if (!readSector(sector, buffer)) {
          DBG_PRINTLN("Failed to read last sector");
          return false;
        }
        
        uint32_t offsetInSector = existingSize % bytesPerSector;
        uint32_t spaceInSector = bytesPerSector - offsetInSector;
        uint32_t toWrite = contentLen < spaceInSector ? contentLen : spaceInSector;
        
        memcpy(buffer + offsetInSector, content, toWrite);
        
        if (!writeSectorRaw(sector, buffer)) {
          DBG_PRINTLN("Failed to write partial sector");
          return false;
        }
        
        bytesWritten = toWrite;
        break;
      }
    }
  }
  
  uint32_t currentCluster = lastCluster;
  
  while (bytesWritten < contentLen) {
    uint32_t sector = clusterToSector(currentCluster);
    memset(buffer, 0, bytesPerSector);
    
    uint32_t toWrite = contentLen - bytesWritten;
    if (toWrite > bytesPerSector) toWrite = bytesPerSector;
    memcpy(buffer, content + bytesWritten, toWrite);
    
    uint32_t sectorInCluster = (bytesWritten + (append ? existingSize : 0)) / bytesPerSector;
    sectorInCluster = sectorInCluster % sectorsPerCluster;
    
    if (!writeSectorRaw(sector + sectorInCluster, buffer)) {
      DBG_PRINTF("Failed to write sector %lu\n", sector);
      return false;
    }
    
    bytesWritten += toWrite;
    
    if (bytesWritten < contentLen) {
      uint32_t nextCluster = findFreeCluster();
      if (nextCluster == 0) {
        DBG_PRINTLN("No more free clusters");
        return false;
      }
      if (!setFatEntry(currentCluster, nextCluster)) {
        DBG_PRINTLN("Failed to chain FAT");
        return false;
      }
      if (!setFatEntry(nextCluster, 0x0FFFFFFF)) {
        DBG_PRINTLN("Failed to mark end of chain");
        return false;
      }
      currentCluster = nextCluster;
    }
  }
  
  uint32_t entriesPerSector = bytesPerSector / 32;
  uint32_t dirSector = rootDirSector;
  uint32_t maxSectors = isFat32 ? (sectorsPerCluster * 16) : (dataStartSector - rootDirSector);
  bool entryFound = false;
  
  for (uint32_t s = 0; s < maxSectors && !entryFound; s++) {
    if (!readSector(dirSector + (s % sectorsPerCluster), buffer)) break;
    
    for (uint32_t e = 0; e < entriesPerSector; e++) {
      uint8_t* entry = buffer + (e * 32);
      
      if (append) {
        if (entry[0] != 0x00 && entry[0] != 0xE5 && !(entry[11] & 0x08)) {
          char name[12];
          memset(name, ' ', 11);
          int j = 0;
          for (int i = 0; filename[i] && j < 11; i++) {
            if (filename[i] == '.') j = 8;
            else if (j < 11) name[j++] = toupper(filename[i]);
          }
          
          bool match = true;
          for (int k = 0; k < 11; k++) {
            if (entry[k] != name[k]) { match = false; break; }
          }
          
          if (match) {
            *(uint32_t*)(entry + 28) = existingSize + contentLen;
            
            if (!writeSectorRaw(dirSector + (s % sectorsPerCluster), buffer)) {
              DBG_PRINTLN("Failed to update directory entry");
              return false;
            }
            
            DBG_PRINTF("File appended: %s (%lu bytes total)\n", filename, existingSize + contentLen);
            return true;
          }
        }
      } else {
        if (entry[0] == 0x00 || entry[0] == 0xE5) {
          memset(entry, 0, 32);
          
          char name[11];
          memset(name, ' ', 11);
          int j = 0;
          for (int i = 0; filename[i] && j < 11; i++) {
            if (filename[i] == '.') j = 8;
            else if (j < 11) name[j++] = toupper(filename[i]);
          }
          memcpy(entry, name, 11);
          
          entry[11] = 0x20;
          entry[26] = firstCluster & 0xFF;
          entry[27] = (firstCluster >> 8) & 0xFF;
          if (isFat32) {
            entry[20] = (firstCluster >> 16) & 0xFF;
            entry[21] = (firstCluster >> 24) & 0xFF;
          }
          *(uint32_t*)(entry + 28) = contentLen;
          
          if (!writeSectorRaw(dirSector + (s % sectorsPerCluster), buffer)) {
            DBG_PRINTLN("Failed to write directory entry");
            return false;
          }
          
          DBG_PRINTF("File written: %s (%lu bytes)\n", filename, contentLen);
          return true;
        }
      }
    }
    
    if (isFat32 && (s + 1) % sectorsPerCluster == 0) {
      uint32_t currentDirCluster = 2 + (dirSector - dataStartSector) / sectorsPerCluster;
      uint32_t nextDirCluster = getNextCluster(currentDirCluster);
      if (nextDirCluster >= 0x0FFFFFF8) break;
      dirSector = clusterToSector(nextDirCluster);
      s = 0;
    }
  }
  
  if (append) {
    DBG_PRINTLN("Failed to find directory entry");
    return false;
  }
  
  DBG_PRINTLN("No free directory entry");
  return false;
}

bool writeFileToCard(const char* filename, const char* content) {
  return writeFileToCard(filename, content, false);
}

void testSPIConnection() {
  DBG_PRINTLN("=== SPI Connection Test ===");
  
  SPI.begin(SD_CLK_PIN, SD_MISO_PIN, SD_MOSI_PIN);
  SPI.setFrequency(100000);
  SPI.setDataMode(SPI_MODE0);
  
  pinMode(SD_CS_PIN, OUTPUT);
  digitalWrite(SD_CS_PIN, HIGH);
  delay(10);
  
  digitalWrite(SD_CS_PIN, LOW);
  delay(1);
  
  for (int i = 0; i < 10; i++) SPI.transfer(0xFF);
  
  SPI.transfer(0x40);
  SPI.transfer(0x00);
  SPI.transfer(0x00);
  SPI.transfer(0x00);
  SPI.transfer(0x00);
  SPI.transfer(0x95);
  
  uint8_t response = 0xFF;
  for (int i = 0; i < 10; i++) {
    response = SPI.transfer(0xFF);
    if (response != 0xFF) break;
  }
  
  digitalWrite(SD_CS_PIN, HIGH);
  
  DBG_PRINTF("MISO pin: %d, Response: 0x%02X\n", digitalRead(SD_MISO_PIN), response);
  DBG_PRINTLN("============================");
}

bool initSDCard() {
  DBG_PRINTLN("\n=== initSDCard Start ===");
  DBG_PRINTF("Pins - CLK: %d, MISO: %d, MOSI: %d, CS: %d\n", SD_CLK_PIN, SD_MISO_PIN, SD_MOSI_PIN, SD_CS_PIN);
  
  SPI.end();
  delay(2000);
  
  SPI.begin(SD_CLK_PIN, SD_MISO_PIN, SD_MOSI_PIN);
  SPI.setFrequency(400000);  // slow for init only
  SPI.setDataMode(SPI_MODE0);
  SPI.setBitOrder(MSBFIRST);
  
  pinMode(SD_CS_PIN, OUTPUT);
  digitalWrite(SD_CS_PIN, HIGH);
  delay(1000);
  
  DBG_PRINTLN("Sending init clocks (400)...");
  digitalWrite(SD_CS_PIN, LOW);
  for (int i = 0; i < 400; i++) {
    SPI.transfer(0xFF);
  }
  digitalWrite(SD_CS_PIN, HIGH);
  delay(500);
  
  DBG_PRINTLN("Sending CMD0...");
  digitalWrite(SD_CS_PIN, LOW);
  SPI.transfer(0x40);
  SPI.transfer(0x00);
  SPI.transfer(0x00);
  SPI.transfer(0x00);
  SPI.transfer(0x00);
  SPI.transfer(0x95);
  
  uint8_t r1 = 0xFF;
  for (int i = 0; i < 20; i++) {
    r1 = SPI.transfer(0xFF);
    if (r1 != 0xFF) break;
  }
  DBG_PRINTF("CMD0 response: 0x%02X\n", r1);
  digitalWrite(SD_CS_PIN, HIGH);
  for (int i = 0; i < 8; i++) SPI.transfer(0xFF);
  
  if (r1 != 0x01) {
    DBG_PRINTLN("CMD0 unexpected response, retrying...");
    delay(500);
    
    digitalWrite(SD_CS_PIN, LOW);
    for (int i = 0; i < 100; i++) SPI.transfer(0xFF);
    SPI.transfer(0x40);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x95);
    
    r1 = 0xFF;
    for (int i = 0; i < 20; i++) {
      r1 = SPI.transfer(0xFF);
      if (r1 != 0xFF) break;
    }
    DBG_PRINTF("CMD0 retry response: 0x%02X\n", r1);
    digitalWrite(SD_CS_PIN, HIGH);
    for (int i = 0; i < 8; i++) SPI.transfer(0xFF);
  }
  
  if (r1 != 0x01) {
    DBG_PRINTLN("CMD0 failed - card not in idle state");
    sdInitialized = false;
    return false;
  }
  
  DBG_PRINTLN("Disabling CRC (CMD59)...");
  digitalWrite(SD_CS_PIN, LOW);
  SPI.transfer(0x7F);
  SPI.transfer(0x00);
  SPI.transfer(0x00);
  SPI.transfer(0x00);
  SPI.transfer(0x00);
  SPI.transfer(0x95);
  r1 = 0xFF;
  for (int i = 0; i < 20; i++) {
    r1 = SPI.transfer(0xFF);
    if (r1 != 0xFF) break;
  }
  digitalWrite(SD_CS_PIN, HIGH);
  for (int i = 0; i < 8; i++) SPI.transfer(0xFF);
  DBG_PRINTF("CMD59 response: 0x%02X\n", r1);
  
  DBG_PRINTLN("Trying MMC init (CMD1)...");
  int attempts = 0;
  while (attempts < 200) {
    digitalWrite(SD_CS_PIN, LOW);
    SPI.transfer(0x41);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0xF9);
    
    r1 = 0xFF;
    for (int i = 0; i < 20; i++) {
      r1 = SPI.transfer(0xFF);
      if (r1 != 0xFF) break;
    }
    digitalWrite(SD_CS_PIN, HIGH);
    for (int i = 0; i < 8; i++) SPI.transfer(0xFF);
    
    DBG_PRINTF("CMD1 response: 0x%02X (attempt %d)\n", r1, attempts);
    
    if (r1 == 0x00) {
      DBG_PRINTLN("MMC card initialized!");
      break;
    }
    
    attempts++;
    delay(10);
  }
  
  if (r1 == 0x00) {
    goto success;
  }
  
  DBG_PRINTLN("MMC init failed, trying SD init (ACMD41)...");
  attempts = 0;
  while (attempts < 200) {
    digitalWrite(SD_CS_PIN, LOW);
    SPI.transfer(0x77);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x65);
    
    r1 = 0xFF;
    for (int i = 0; i < 20; i++) {
      r1 = SPI.transfer(0xFF);
      if (r1 != 0xFF) break;
    }
    digitalWrite(SD_CS_PIN, HIGH);
    for (int i = 0; i < 8; i++) SPI.transfer(0xFF);
    
    if (r1 != 0x01 && r1 != 0x00) {
      DBG_PRINTF("CMD55 response: 0x%02X\n", r1);
    }
    
    delay(1);
    
    digitalWrite(SD_CS_PIN, LOW);
    SPI.transfer(0x69);
    SPI.transfer(0x40);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x77);
    
    r1 = 0xFF;
    for (int i = 0; i < 20; i++) {
      r1 = SPI.transfer(0xFF);
      if (r1 != 0xFF) break;
    }
    digitalWrite(SD_CS_PIN, HIGH);
    for (int i = 0; i < 8; i++) SPI.transfer(0xFF);
    
    DBG_PRINTF("ACMD41 response: 0x%02X (attempt %d)\n", r1, attempts);
    
    if (r1 == 0x00) {
      DBG_PRINTLN("SD card initialized!");
      break;
    }
    
    attempts++;
    delay(10);
  }
  
  if (r1 != 0x00) {
    DBG_PRINTF("Init failed, final response: 0x%02X\n", r1);
    sdInitialized = false;
    return false;
  }
  
success:
  {
    digitalWrite(SD_CS_PIN, LOW);
    SPI.transfer(0xFF);
    SPI.transfer(0x7A);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x75);
    
    r1 = 0xFF;
    for (int i = 0; i < 20; i++) {
      r1 = SPI.transfer(0xFF);
      if (r1 != 0xFF) break;
    }
    
    uint8_t ocr[4] = {0};
    if (r1 == 0x00) {
      for (int i = 0; i < 4; i++) {
        ocr[i] = SPI.transfer(0xFF);
      }
    }
    digitalWrite(SD_CS_PIN, HIGH);
    for (int i = 0; i < 8; i++) SPI.transfer(0xFF);
    
  isSDHC = (ocr[0] & 0x40) != 0;
  DBG_PRINTF("CMD58 OCR: %02X %02X %02X %02X, SDHC: %s\n", 
                ocr[0], ocr[1], ocr[2], ocr[3], isSDHC ? "YES" : "NO");
  
  DBG_PRINTLN("Forcing SDHC mode (block addressing)...");
  isSDHC = true;
  }
  
  useManualMode = true;
  sdInitialized = true;

  // Raise SPI clock to full speed now that card is initialized
  SPI.setFrequency(4000000);

  DBG_PRINTLN("=== Card OK (manual mode) ===");
  return true;
}

bool sdWriteFile(const char* path, const char* message) {
  if (!sdInitialized) return false;
  
  File file = SD.open(path, FILE_WRITE);
  if (!file) {
    return false;
  }
  
  file.print(message);
  file.close();
  return true;
}

String sdReadFile(const char* path) {
  if (!sdInitialized) return "";
  
  File file = SD.open(path);
  if (!file) {
    return "";
  }
  
  String content = "";
  while (file.available()) {
    content += (char)file.read();
  }
  file.close();
  return content;
}

bool sdAppendFile(const char* path, const char* message) {
  if (!sdInitialized) return false;
  
  File file = SD.open(path, FILE_APPEND);
  if (!file) {
    return false;
  }
  
  file.print(message);
  file.close();
  return true;
}

bool sdDeleteFile(const char* path) {
  if (!sdInitialized) return false;
  return SD.remove(path);
}

bool sdExists(const char* path) {
  if (!sdInitialized) return false;
  return SD.exists(path);
}

void sdListFiles() {
  if (!sdInitialized) return;
  
  File root = SD.open("/");
  if (!root) return;
  
  File file = root.openNextFile();
  while (file) {
    file = root.openNextFile();
  }
}

void testSDCard() {
  initOLED();
  
  char buffer[128];
  int passed = 0;
  int failed = 0;
  bool testResults[7] = {false};
  
  DBG_PRINTLN("\n========================================");
  DBG_PRINTLN("       SD CARD COMPREHENSIVE TEST");
  DBG_PRINTLN("========================================\n");
  
  writeToOled("SD Card Test\nInitializing...");
  delay(500);
  
  DBG_PRINTLN("TEST 1: SD Card Initialization");
  DBG_PRINTLN("----------------------------------------");
  bool success = initSDCard();
  
  if (!success) {
    DBG_PRINTLN("RESULT: FAILED\n");
    writeToOled("Init: FAILED\nCheck connection");
    delay(3000);
    clearOled();
    return;
  }
  
  DBG_PRINTLN("RESULT: PASSED\n");
  passed++;
  testResults[0] = true;
  
  DBG_PRINTLN("TEST 2: Delete Old Test File");
  DBG_PRINTLN("----------------------------------------");
  deleteFileFromCard("testwrite.txt");
  DBG_PRINTLN("RESULT: DONE\n");
  
  DBG_PRINTLN("TEST 3: List Files");
  DBG_PRINTLN("----------------------------------------");
  listFilesFromCard();
  DBG_PRINTLN("RESULT: PASSED\n");
  passed++;
  testResults[1] = true;
  
  DBG_PRINTLN("TEST 4: Write New File");
  DBG_PRINTLN("----------------------------------------");
  bool writeOk = writeFileToCard("testwrite.txt", "Hello from SD Card!");
  if (writeOk) {
    DBG_PRINTLN("RESULT: PASSED\n");
    passed++;
    testResults[2] = true;
  } else {
    DBG_PRINTLN("RESULT: FAILED\n");
    failed++;
  }
  
  DBG_PRINTLN("TEST 5: Read Written File");
  DBG_PRINTLN("----------------------------------------");
  String readContent = readFileFromCard("testwrite.txt");
  DBG_PRINTF("Content: \"%s\"\n", readContent.c_str());
  if (readContent == "Hello from SD Card!") {
    DBG_PRINTLN("RESULT: PASSED\n");
    passed++;
    testResults[3] = true;
  } else {
    DBG_PRINTLN("RESULT: FAILED\n");
    failed++;
  }
  
  DBG_PRINTLN("TEST 6: Append to File");
  DBG_PRINTLN("----------------------------------------");
  bool appendOk = writeFileToCard("testwrite.txt", " Appended!", true);
  if (appendOk) {
    DBG_PRINTLN("RESULT: PASSED\n");
    passed++;
    testResults[4] = true;
  } else {
    DBG_PRINTLN("RESULT: FAILED\n");
    failed++;
  }
  
  DBG_PRINTLN("TEST 7: Verify Appended Content");
  DBG_PRINTLN("----------------------------------------");
  readContent = readFileFromCard("testwrite.txt");
  DBG_PRINTF("Content: \"%s\"\n", readContent.c_str());
  if (readContent == "Hello from SD Card! Appended!") {
    DBG_PRINTLN("RESULT: PASSED\n");
    passed++;
    testResults[5] = true;
  } else {
    DBG_PRINTLN("RESULT: FAILED\n");
    failed++;
  }
  
  DBG_PRINTLN("TEST 8: List Files After Write");
  DBG_PRINTLN("----------------------------------------");
  listFilesFromCard();
  DBG_PRINTLN("RESULT: PASSED\n");
  passed++;
  testResults[6] = true;
  
  DBG_PRINTLN("========================================");
  DBG_PRINTLN("           TEST SUMMARY");
  DBG_PRINTLN("========================================");
  DBG_PRINTF("PASSED: %d\n", passed);
  DBG_PRINTF("FAILED: %d\n", failed);
  DBG_PRINTLN("========================================\n");
  
  snprintf(buffer, sizeof(buffer), 
    "1.Init:%s 2.Del:--\n3.List:%s 4.Write:%s\n5.Read:%s 6.Append:%s\n7.Verify:%s 8.List:%s\n%s %d/7",
    testResults[0] ? "OK" : "FAIL",
    testResults[1] ? "OK" : "FAIL",
    testResults[2] ? "OK" : "FAIL",
    testResults[3] ? "OK" : "FAIL",
    testResults[4] ? "OK" : "FAIL",
    testResults[5] ? "OK" : "FAIL",
    testResults[6] ? "OK" : "FAIL",
    failed == 0 ? "ALL" : "SUM",
    passed);
  
  writeToOled(buffer);
  delay(5000);
  
  clearOled();
}

int openAudioFile(const char* filename) {
  if (!sdInitialized) {
    DBG_PRINTLN("SD not initialized");
    return -1;
  }
  
  if (fatStartSector == 0) {
    if (!initFatFS()) {
      DBG_PRINTLN("FAT init failed");
      return -1;
    }
  }
  
  uint32_t fileSize, startCluster;
  int32_t found = findFile(filename, &fileSize, &startCluster);
  
  if (found < 0) {
    DBG_PRINTF("Audio file not found: %s\n", filename);
    return -1;
  }
  
  int handle = -1;
  for (int i = 0; i < MAX_AUDIO_FILES; i++) {
    if (!audioFiles[i].inUse) {
      handle = i;
      break;
    }
  }
  
  if (handle < 0) {
    DBG_PRINTLN("No free audio file handles");
    return -1;
  }
  
  audioFiles[handle].inUse = true;
  audioFiles[handle].startCluster = startCluster;
  audioFiles[handle].fileSize = fileSize;
  audioFiles[handle].currentCluster = startCluster;
  audioFiles[handle].bytesRead = 0;
  audioFiles[handle].sectorInCluster = 0;
  
  DBG_PRINTF("Opened audio file: %s, size: %lu, handle: %d\n", filename, fileSize, handle);
  
  return handle;
}

int readAudioChunk(int handle, uint8_t* buffer, int maxBytes) {
  if (handle < 0 || handle >= MAX_AUDIO_FILES || !audioFiles[handle].inUse) {
    return -1;
  }
  
  AudioFileHandle* af = &audioFiles[handle];
  
  if (af->bytesRead >= af->fileSize) {
    return 0;
  }
  
  uint8_t sectorBuffer[512];
  int totalRead = 0;
  
  while (totalRead < maxBytes && af->bytesRead < af->fileSize) {
    uint32_t cluster = af->currentCluster;
    uint32_t sector = clusterToSector(cluster) + af->sectorInCluster;
    
    if (!readSector(sector, sectorBuffer)) {
      DBG_PRINTF("Failed to read sector %lu\n", sector);
      break;
    }
    
    uint32_t offsetInSector = (af->bytesRead % 512);
    uint32_t bytesLeftInFile = af->fileSize - af->bytesRead;
    uint32_t bytesLeftInSector = 512 - offsetInSector;
    uint32_t bytesLeftToRead = maxBytes - totalRead;
    
    uint32_t toCopy = bytesLeftInSector;
    if (toCopy > bytesLeftInFile) toCopy = bytesLeftInFile;
    if (toCopy > bytesLeftToRead) toCopy = bytesLeftToRead;
    
    memcpy(buffer + totalRead, sectorBuffer + offsetInSector, toCopy);
    
    totalRead += toCopy;
    af->bytesRead += toCopy;
    
    if (af->bytesRead % 512 == 0 || af->bytesRead >= af->fileSize) {
      af->sectorInCluster++;
      
      if (af->sectorInCluster >= sectorsPerCluster) {
        af->sectorInCluster = 0;
        uint32_t nextCluster = getNextCluster(cluster);
        
        if (nextCluster < 2 || nextCluster >= 0x0FFFFFF8) {
          break;
        }
        
        af->currentCluster = nextCluster;
      }
    }
  }
  
  return totalRead;
}

void closeAudioFile(int handle) {
  if (handle >= 0 && handle < MAX_AUDIO_FILES) {
    audioFiles[handle].inUse = false;
    DBG_PRINTF("Closed audio file handle: %d\n", handle);
  }
}

bool getAudioFileInfo(const char* filename, uint32_t* size) {
  if (!sdInitialized) return false;
  
  if (fatStartSector == 0) {
    if (!initFatFS()) return false;
    }
  
  uint32_t fileSize, startCluster;
  int32_t found = findFile(filename, &fileSize, &startCluster);
  
  if (found < 0) return false;
  
  if (size) *size = fileSize;
  return true;
}

uint32_t getAudioFilePosition(int handle) {
  if (handle < 0 || handle >= MAX_AUDIO_FILES || !audioFiles[handle].inUse) {
    return 0;
  }
  return audioFiles[handle].bytesRead;
}

bool isAudioFileOpen(int handle) {
  if (handle < 0 || handle >= MAX_AUDIO_FILES) return false;
  return audioFiles[handle].inUse;
}
