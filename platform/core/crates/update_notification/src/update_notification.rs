use std::sync::Arc;
use std::sync::Mutex;

#[derive(Eq, PartialEq, Copy, Clone)]
#[repr(C)]
pub enum Seen {
    NOT,
    PUSH,
    ALL,
}

#[derive(Copy, Clone)]
pub struct LastNotification {
    id: u32,
    state: Seen,
}

pub trait UpdateNotificationStore {
    fn get_last_notification(&self) -> Option<LastNotification>;
    fn set_last_notification(&mut self, last_notification: LastNotification);
}

#[repr(C)]
pub struct UpdateNotification {
    id: u32,
    store: Arc<Mutex<dyn UpdateNotificationStore>>,
}

impl UpdateNotification {
    pub fn new(id: u32, store: Arc<Mutex<dyn UpdateNotificationStore>>) -> Self {
        Self {
            id: id,
            store: store.clone(),
        }
    }

    pub fn id(&self) -> u32 {
        self.id
    }

    fn get_last_notification(&self) -> LastNotification {
        self.store
            .lock()
            .unwrap()
            .get_last_notification()
            .unwrap_or(LastNotification {
                id: 0,
                state: Seen::NOT,
            })
    }

    fn show<F: Fn(Seen) -> bool>(&self, show_for_last_state: F) -> bool {
        let last_notification = self.get_last_notification();
        if self.id == 0 || self.id < last_notification.id {
            return false;
        }
        if self.id > last_notification.id {
            return true;
        }
        show_for_last_state(last_notification.state)
    }

    pub fn handle_first_run(&mut self) {
        self.handle_in_app_seen();
    }

    pub fn handle_startup(&mut self) {
        self.handle_push_seen();
    }

    pub fn show_in_app(&self) -> bool {
        self.show(|state| state != Seen::ALL)
    }

    pub fn show_push(&self) -> bool {
        self.show(|state| state == Seen::NOT)
    }

    fn update_last(&mut self, state: Seen) {
        self.store
            .lock()
            .unwrap()
            .set_last_notification(LastNotification {
                id: self.id,
                state: state,
            });
    }

    pub fn handle_in_app_seen(&mut self) {
        self.update_last(Seen::ALL);
    }

    pub fn handle_push_seen(&mut self) {
        if self.get_last_notification().state != Seen::NOT {
            return;
        }
        self.update_last(Seen::PUSH);
    }
}
