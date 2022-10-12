use std::sync::{Arc, Mutex};
use update_notification::*;

struct MockStore {
    last_notification: Arc<Mutex<Option<LastNotification>>>,
}

impl MockStore {
    fn new() -> MockStore {
        MockStore {
            last_notification: Arc::new(Mutex::from(None)),
        }
    }
}

impl UpdateNotificationStore for MockStore {
    fn get_last_notification(&self) -> Option<LastNotification> {
        self.last_notification.lock().unwrap().clone()
    }

    fn set_last_notification(&self, last_notification: LastNotification) {
        let mut old_last_notification = self.last_notification.lock().unwrap();
        *old_last_notification = Some(last_notification)
    }
}

macro_rules! assert_in_app_showing {
    ($notification: expr) => {
        assert!(
            $notification.show_in_app(),
            "Expected in app notification with id '{}' to show",
            $notification.get_id()
        );
    };
}

macro_rules! assert_in_app_not_showing {
    ($notification: expr) => {
        assert!(
            !$notification.show_in_app(),
            "Expected in app notification with id '{}' to not show",
            $notification.get_id()
        );
    };
}

macro_rules! assert_push_showing {
    ($notification: expr) => {
        assert!(
            $notification.show_push(),
            "Expected push notification with id '{}' to show",
            $notification.get_id()
        );
    };
}

macro_rules! assert_push_not_showing {
    ($notification: expr) => {
        assert!(
            !$notification.show_push(),
            "Expected push notification with id '{}' to not show",
            $notification.get_id()
        );
    };
}

macro_rules! assert_none_showing {
    ($notification: expr) => {
        assert_in_app_not_showing!($notification);
        assert_push_not_showing!($notification);
    };
}

macro_rules! assert_all_showing {
    ($notification: expr) => {
        assert_in_app_showing!($notification);
        assert_push_showing!($notification);
    };
}

fn create_store() -> Arc<MockStore> {
    Arc::new(MockStore::new())
}

fn create_notification(mock_id: u32, store: &Arc<MockStore>) -> UpdateNotification {
    UpdateNotification::new(mock_id, store.clone())
}

#[test]
fn notification_with_id_0_seen() {
    let store = create_store();
    let notification = create_notification(0, &store);
    assert_none_showing!(notification);
}

#[test]
fn first_notification_not_seen() {
    let store = create_store();
    let notification = create_notification(1, &store);
    assert_all_showing!(notification);
}

#[test]
fn previously_seen_notification_seen() {
    let store = create_store();
    let mut notification = create_notification(1, &store);
    notification.handle_in_app_seen();
    assert_none_showing!(notification);
}

#[test]
fn additional_notification_not_seen() {
    let store = create_store();
    let mut notification = create_notification(1, &store);
    notification.handle_in_app_seen();

    let second_notification = create_notification(2, &store);
    assert_all_showing!(second_notification);
}

#[test]
fn additonal_notification_with_lower_id_seen() {
    let store = create_store();
    let mut notification = create_notification(2, &store);
    notification.handle_in_app_seen();

    let second_notification = create_notification(1, &store);
    assert_none_showing!(second_notification);
}

#[test]
fn push_notification_seen_after_startup() {
    let store = create_store();
    let mut notification = create_notification(1, &store);
    notification.handle_startup();
    assert_in_app_showing!(notification);
    assert_push_not_showing!(notification);
}

#[test]
fn in_app_not_seen_after_push_seen() {
    let store = create_store();
    let mut notification = create_notification(1, &store);
    notification.handle_push_seen();
    assert_in_app_showing!(notification);
    assert_push_not_showing!(notification);
}

#[test]
fn all_seen_after_first_run() {
    let store = create_store();
    let mut notification = create_notification(1, &store);
    notification.handle_first_run();
    assert_none_showing!(notification);
}
