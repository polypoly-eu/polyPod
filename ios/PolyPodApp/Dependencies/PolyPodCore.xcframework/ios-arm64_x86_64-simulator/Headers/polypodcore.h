#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

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

struct PolyPodCore *new_core(struct KeyValueStore key_value_store);

void destroy_core(struct PolyPodCore *core);

void handle_push_seen(struct PolyPodCore *core);

void handle_in_app_seen(struct PolyPodCore *core);

void handle_first_run(struct PolyPodCore *core);

void handle_startup(struct PolyPodCore *core);

bool show_in_app(const struct PolyPodCore *core);

bool show_push(const struct PolyPodCore *core);
