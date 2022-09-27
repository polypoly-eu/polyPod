use std::cell::RefCell;
use std::rc::Rc;

#[derive(PartialEq, Copy, Clone)]
#[repr(C)]
pub enum Seen {
    NOT,
    PUSH,
    ALL,
}

pub trait UpdateNotificationStorage {
    fn read_id(&self) -> u32;
    fn read_last_id(&self) -> Option<u32>;
    fn read_last_state(&self) -> Option<Seen>;
    fn write_last(&mut self, id: u32, state: Seen);
}

#[repr(C)]
pub struct UpdateNotification {
    storage: Rc<RefCell<dyn UpdateNotificationStorage>>,
    id: u32,
    last_id: u32,
    last_state: Seen,
}

impl UpdateNotification {
    // Would be ideal if the storage instance could just be passed in as a
    // reference, or anything simpler than Rc<RefCell<>>.
    pub fn new(storage: Rc<RefCell<dyn UpdateNotificationStorage>>) -> Self {
        Self {
            storage: storage.clone(),
            id: storage.borrow().read_id(),
            last_id: storage.borrow().read_last_id().unwrap_or(0),
            last_state: storage.borrow().read_last_state().unwrap_or(Seen::NOT),
        }
    }

    pub fn id(&self) -> u32 {
        self.id
    }

    fn show<F: Fn(Seen) -> bool>(&self, show_for_last_state: F) -> bool {
        if self.id == 0 || self.id < self.last_id {
            return false;
        }
        if self.id > self.last_id {
            return true;
        }
        show_for_last_state(self.last_state)
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
        self.last_id = self.id;
        self.last_state = state;
        self.storage
            .borrow_mut()
            .write_last(self.last_id, self.last_state);
    }

    pub fn handle_in_app_seen(&mut self) {
        self.update_last(Seen::ALL);
    }

    pub fn handle_push_seen(&mut self) {
        if self.last_state != Seen::NOT {
            return;
        }
        self.update_last(Seen::PUSH);
    }
}
