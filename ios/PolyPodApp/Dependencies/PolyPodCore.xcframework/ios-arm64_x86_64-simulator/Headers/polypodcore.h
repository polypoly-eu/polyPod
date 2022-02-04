#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

/**
 * Core implementation
 */
typedef struct PolyPodCore PolyPodCore;

typedef enum OptionUsize_Tag {
  Some,
  None,
} OptionUsize_Tag;

typedef struct OptionUsize {
  OptionUsize_Tag tag;
  union {
    struct {
      uintptr_t some;
    };
  };
} OptionUsize;

typedef struct KeyValueStore {
  void *context;
  struct OptionUsize (*read_int)(void *context, const char *key);
  void (*write_int)(void *context, const char *key, uintptr_t value);
} KeyValueStore;

typedef enum OptionKeyValueStore_Tag {
  Default,
  Custom,
} OptionKeyValueStore_Tag;

typedef struct OptionKeyValueStore {
  OptionKeyValueStore_Tag tag;
  union {
    struct {
      const char *default_;
    };
    struct {
      struct KeyValueStore custom;
    };
  };
} OptionKeyValueStore;

struct PolyPodCore *new_poly_pod_core(struct OptionKeyValueStore kv_store);

void destroy_poly_pod_core(struct PolyPodCore *core);

void update_notification_handle_push_seen(struct PolyPodCore *core);

void update_notification_handle_in_app_seen(struct PolyPodCore *core);

void update_notification_handle_first_run(struct PolyPodCore *core);

void update_notification_handle_startup(struct PolyPodCore *core);

bool update_notification_show_in_app(const struct PolyPodCore *core);

bool update_notification_show_push(const struct PolyPodCore *core);
