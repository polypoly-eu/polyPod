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

/**
 * # Safety
 * This function can be unsafe if the language_code pointer is null or the string is in wrong format.
 *
 * Mention - It is needed to be tested in integration if `*const u8` is the appropriate return format.
 *           Also, most likely, it will be required to expose an API to deallocate the byte buffer after parsing.
 *
 * Bootstrap core with the given configuration:
 * - language_code: User's locale language code.
 * Returns a MessagePack byte array with core_bootstrap_response.
 */
struct CByteBuffer core_bootstrap(struct CByteBuffer args,
                                  struct BridgeToPlatform bridge);

struct CByteBuffer execute_request(struct CByteBuffer core_request);

/**
 * Executes the given RDF query.
 * Returns Result<String, CoreFailure> as MessagePack value.
 */
struct CByteBuffer exec_rdf_query(const char *query);

/**
 * Executes the given RDF update.
 * Returns Result<Void, CoreFailure> as MessagePack value.
 */
struct CByteBuffer exec_rdf_update(const char *update);

/**
 * # Safety
 * This function can be unsafe if trying to deallocate invalid memory.
 *
 * Drops the given bytes.
 */
void free_bytes(uint8_t *bytes);
