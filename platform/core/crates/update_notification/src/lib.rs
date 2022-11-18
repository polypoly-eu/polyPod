use serde::{Deserialize, Serialize};
use std::fmt;
use std::sync::Arc;

#[derive(Eq, PartialEq, Copy, Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum State {
    NotSeen,
    PushSeen,
    AllSeen,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LastNotification {
    pub id: u32,
    pub state: State,
}

pub trait UpdateNotificationStore: Send + Sync {
    fn get_last_notification(&self) -> Option<LastNotification>;
    fn set_last_notification(&self, last_notification: LastNotification);
}

pub struct UpdateNotification {
    pub id: u32,
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
                state: State::NotSeen,
            })
    }

    fn should_show<F: Fn(State) -> bool>(&self, show_for_last_state: F) -> bool {
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

    pub fn should_show_in_app(&self) -> bool {
        self.should_show(|state| state != State::AllSeen)
    }

    pub fn should_show_push(&self) -> bool {
        self.should_show(|state| state == State::NotSeen)
    }

    fn update_last(&mut self, state: State) {
        self.store
            .set_last_notification(LastNotification { id: self.id, state });
    }

    pub fn handle_in_app_seen(&mut self) {
        self.update_last(State::AllSeen);
    }

    pub fn handle_push_seen(&mut self) {
        if self.get_last_notification().state != State::NotSeen {
            return;
        }
        self.update_last(State::PushSeen);
    }

    pub fn migrate_last_id(&self, id: String) {
        let mut last_notification = self.get_last_notification();
        last_notification.id = id.parse::<u32>().unwrap();
        self.store.set_last_notification(last_notification);
    }

    pub fn migrate_last_state(&self, state: String) {
        let mut last_notification = self.get_last_notification();
        last_notification.state = match state.as_str() {
            "NOT_SEEN" => State::NotSeen,
            "PUSH_SEEN" => State::PushSeen,
            _ => State::AllSeen,
        };
        self.store.set_last_notification(last_notification);
    }
}

impl fmt::Debug for UpdateNotification {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("UpdateNotification")
            .field("id", &self.id)
            .finish()
    }
}
