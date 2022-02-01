#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

typedef enum Seen {
  NOT,
  PUSH,
  ALL,
} Seen;

typedef struct UpdateNotification UpdateNotification;

typedef enum Option32_Tag {
  Some32,
  None32,
} Option32_Tag;

typedef struct Option32 {
  Option32_Tag tag;
  union {
    struct {
      uint32_t some32;
    };
  };
} Option32;

typedef enum OptionSeen_Tag {
  SomeSeen,
  NoneSeen,
} OptionSeen_Tag;

typedef struct OptionSeen {
  OptionSeen_Tag tag;
  union {
    struct {
      enum Seen some_seen;
    };
  };
} OptionSeen;

typedef struct UpdateNotificationStorage {
  void *context;
  uint32_t (*read_id)(void *context);
  struct Option32 (*read_last_id)(void *context);
  struct OptionSeen (*read_last_state)(void *context);
  void (*write_last)(void *context, uint32_t id, enum Seen state);
} UpdateNotificationStorage;

struct UpdateNotification *new_update_notification(struct UpdateNotificationStorage storage);

void destroy_notification(struct UpdateNotification *notification);

void handle_push_seen(struct UpdateNotification *notification);

void handle_in_app_seen(struct UpdateNotification *notification);

void handle_first_run(struct UpdateNotification *notification);

void handle_startup(struct UpdateNotification *notification);

bool show_in_app(struct UpdateNotification *notification);

bool show_push(struct UpdateNotification *notification);
