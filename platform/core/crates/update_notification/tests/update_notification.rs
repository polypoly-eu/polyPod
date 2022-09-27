use std::cell::RefCell;
use std::rc::Rc;
use update_notification::update_notification::*;

struct MockUpdateNotificationStorage {
    mock_id: Option<u32>,
    last_id: Option<u32>,
    last_state: Option<Seen>,
}

impl MockUpdateNotificationStorage {
    fn new() -> MockUpdateNotificationStorage {
        MockUpdateNotificationStorage {
            mock_id: None,
            last_id: None,
            last_state: None,
        }
    }
}

impl UpdateNotificationStorage for MockUpdateNotificationStorage {
    fn read_id(&self) -> u32 {
        self.mock_id.unwrap()
    }

    fn read_last_id(&self) -> Option<u32> {
        self.last_id
    }

    fn read_last_state(&self) -> Option<Seen> {
        self.last_state.clone()
    }

    fn write_last(&mut self, id: u32, state: Seen) {
        self.last_id = Some(id);
        self.last_state = Some(state);
    }
}

macro_rules! assert_in_app_showing {
    ($notification: expr) => {
        assert!(
            $notification.show_in_app(),
            "Expected in app notification with id '{}' to show",
            $notification.id()
        );
    };
}

macro_rules! assert_in_app_not_showing {
    ($notification: expr) => {
        assert!(
            !$notification.show_in_app(),
            "Expected in app notification with id '{}' to not show",
            $notification.id()
        );
    };
}

macro_rules! assert_push_showing {
    ($notification: expr) => {
        assert!(
            $notification.show_push(),
            "Expected push notification with id '{}' to show",
            $notification.id()
        );
    };
}

macro_rules! assert_push_not_showing {
    ($notification: expr) => {
        assert!(
            !$notification.show_push(),
            "Expected push notification with id '{}' to not show",
            $notification.id()
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

fn create_storage() -> Rc<RefCell<MockUpdateNotificationStorage>> {
    Rc::new(RefCell::new(MockUpdateNotificationStorage::new()))
}

fn create_notification(
    storage: &Rc<RefCell<MockUpdateNotificationStorage>>,
    mock_id: u32,
) -> UpdateNotification {
    storage.borrow_mut().mock_id = Some(mock_id);
    UpdateNotification::new(storage.clone())
}

#[test]
fn notification_with_id_0_seen() {
    let storage = create_storage();
    let notification = create_notification(&storage, 0);
    assert_none_showing!(notification);
}

#[test]
fn first_notification_not_seen() {
    let storage = create_storage();
    let notification = create_notification(&storage, 1);
    assert_all_showing!(notification);
}

#[test]
fn previously_seen_notification_seen() {
    let storage = create_storage();
    let mut notification = create_notification(&storage, 1);
    notification.handle_in_app_seen();
    assert_none_showing!(notification);
}

#[test]
fn additional_notification_not_seen() {
    let storage = create_storage();
    let mut notification = create_notification(&storage, 1);
    notification.handle_in_app_seen();

    let second_notification = create_notification(&storage, 2);
    assert_all_showing!(second_notification);
}

#[test]
fn additonal_notification_with_lower_id_seen() {
    let storage = create_storage();
    let mut notification = create_notification(&storage, 2);
    notification.handle_in_app_seen();

    let second_notification = create_notification(&storage, 1);
    assert_none_showing!(second_notification);
}

#[test]
fn push_notification_seen_after_startup() {
    let storage = create_storage();
    let mut notification = create_notification(&storage, 1);
    notification.handle_startup();
    assert_in_app_showing!(notification);
    assert_push_not_showing!(notification);
}

#[test]
fn in_app_not_seen_after_push_seen() {
    let storage = create_storage();
    let mut notification = create_notification(&storage, 1);
    notification.handle_push_seen();
    assert_in_app_showing!(notification);
    assert_push_not_showing!(notification);
}

#[test]
fn all_seen_after_first_run() {
    let storage = create_storage();
    let mut notification = create_notification(&storage, 1);
    notification.handle_first_run();
    assert_none_showing!(notification);
}
