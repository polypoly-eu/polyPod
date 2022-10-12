use serde::{Deserialize, Serialize};
use std::fmt;
use std::sync::Arc;

#[derive(Eq, PartialEq, Copy, Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Seen {
    Not,
    Push,
    All,
}

#[derive(Copy, Clone, Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LastNotification {
    id: u32,
    state: Seen,
}

pub trait UpdateNotificationStore: Send + Sync {
    fn get_last_notification(&self) -> Option<LastNotification>;
    fn set_last_notification(&self, last_notification: LastNotification);
}

pub struct UpdateNotification {
    id: u32,
    store: Arc<dyn UpdateNotificationStore>,
}

impl UpdateNotification {
    pub fn new(id: u32, store: Arc<dyn UpdateNotificationStore>) -> Self {
        Self {
            id,
            store: store.clone(),
        }
    }

    fn get_last_notification(&self) -> LastNotification {
        self.store
            .get_last_notification()
            .unwrap_or(LastNotification {
                id: 0,
                state: Seen::Not,
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
        self.show(|state| state != Seen::All)
    }

    pub fn show_push(&self) -> bool {
        self.show(|state| state == Seen::Not)
    }

    fn update_last(&mut self, state: Seen) {
        self.store
            .set_last_notification(LastNotification { id: self.id, state });
    }

    pub fn handle_in_app_seen(&mut self) {
        self.update_last(Seen::All);
    }

    pub fn handle_push_seen(&mut self) {
        if self.get_last_notification().state != Seen::Not {
            return;
        }
        self.update_last(Seen::Push);
    }
}

impl fmt::Display for UpdateNotification {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "(id = {})", self.id)
    }
}
