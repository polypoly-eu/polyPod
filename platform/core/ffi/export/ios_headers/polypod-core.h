#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

typedef struct CByteBuffer {
  unsigned int length;
  uint8_t *data;
} CByteBuffer;

typedef struct BridgeToPlatform {
  void (*free_bytes)(uint8_t *bytes);
  struct CByteBuffer (*perform_request)(struct CByteBuffer request);
} BridgeToPlatform;

struct CByteBuffer core_bootstrap(struct CByteBuffer args,
                                  struct BridgeToPlatform bridge);

struct CByteBuffer execute_request(struct CByteBuffer core_request);

void free_bytes(uint8_t *bytes);
