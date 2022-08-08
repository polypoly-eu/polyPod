use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::time::{Duration, Instant};
use strum::IntoEnumIterator;
use strum_macros::EnumIter;

#[derive(Serialize)]
pub struct UserSessionTimeout {
    option: TimeoutOption,
    duration: Option<u8>,
}

#[derive(Debug, PartialEq, Clone, Serialize, Deserialize, EnumIter)]
pub enum TimeoutOption {
    Option1,
    Option2,
    Option3,
    NoTimeout,
}

const ONE_MINUTE_IN_SECONDS: u8 = 60;

impl TimeoutOption {
    pub fn duration(&self) -> Option<u8> {
        match self {
            Option1 => Some(5 * ONE_MINUTE_IN_SECONDS),
            Option2 => Some(15 * ONE_MINUTE_IN_SECONDS),
            Option3 => Some(60 * ONE_MINUTE_IN_SECONDS),
            NoTimeout => None,
        }
    }

    pub fn default_option() -> Self {
        Self::Option2
    }

    pub fn all_option_timeouts() -> Vec<UserSessionTimeout> {
        TimeoutOption::iter()
            .map(|option| UserSessionTimeout {
                option: option.clone(),
                duration: option.duration(),
            })
            .collect()
    }
}

pub trait TimeoutOptionStore: Sync + Send {
    fn get_timeout_option(&self) -> Option<TimeoutOption>;
    fn set_timeout_option(&self, option: TimeoutOption);
}

type TimeStampBuilder<'a> = Box<dyn Fn() -> Instant + Sync + Send + 'a>;

pub struct UserSession<'a> {
    inactive_timestamp: Option<Instant>,
    timestamp_builder: TimeStampBuilder<'a>,
    store: Arc<dyn TimeoutOptionStore>,
}

impl<'a> UserSession<'a> {
    pub fn new(
        timestamp_builder: TimeStampBuilder<'a>,
        store: Arc<dyn TimeoutOptionStore>,
    ) -> Self {
        UserSession {
            inactive_timestamp: None,
            timestamp_builder,
            store,
        }
    }

    pub fn is_session_expired(&self) -> bool {
        match (
            self.inactive_timestamp,
            self.get_timeout_option().duration(),
        ) {
            (Some(timestamp), Some(interval)) => {
                let now = (self.timestamp_builder)();
                timestamp + Duration::new(interval.into(), 0) <= now
            }
            _ => false,
        }
    }

    pub fn did_become_inactive(&mut self) {
        self.inactive_timestamp = Some((self.timestamp_builder)());
    }

    pub fn set_timeout_option(&self, option: TimeoutOption) {
        self.store.set_timeout_option(option)
    }

    pub fn get_timeout_option(&self) -> TimeoutOption {
        self.store
            .get_timeout_option()
            .unwrap_or_else(TimeoutOption::default_option)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Mutex;

    struct MockStore {
        timeout_option: Arc<Mutex<Option<TimeoutOption>>>,
    }

    impl MockStore {
        fn new(option: Option<TimeoutOption>) -> MockStore {
            MockStore {
                timeout_option: Arc::new(Mutex::from(option)),
            }
        }
    }

    impl TimeoutOptionStore for MockStore {
        fn get_timeout_option(&self) -> Option<TimeoutOption> {
            self.timeout_option.lock().unwrap().clone()
        }

        fn set_timeout_option(&self, option: TimeoutOption) {
            print!("set timeout calloed");
            let mut timeout = self.timeout_option.lock().unwrap();
            *timeout = Some(option)
        }
    }

    #[test]
    fn get_timeout_option_no_stored_option_returns_default() {
        let session = UserSession::new(Box::new(Instant::now), Arc::new(MockStore::new(None)));

        assert_eq!(
            session.get_timeout_option(),
            TimeoutOption::default_option()
        )
    }

    #[test]
    fn get_timeout_option_returns_stored_option() {
        let stored_option = TimeoutOption::Option1;
        let session = UserSession::new(
            Box::new(Instant::now),
            Arc::new(MockStore::new(Some(stored_option.clone()))),
        );

        assert_eq!(session.get_timeout_option(), stored_option)
    }

    #[test]
    fn app_becomes_inactive_saves_the_timestamp() {
        let timestamp = Instant::now();
        let mut session = UserSession::new(Box::new(|| timestamp), Arc::new(MockStore::new(None)));

        session.did_become_inactive();
        assert_eq!(session.inactive_timestamp, Some(timestamp))
    }

    #[test]
    fn app_becomes_active_returns_correct_expired_state() {
        let timestamp = Mutex::from(Instant::now());
        let stored_option = TimeoutOption::Option1;
        let timeout_interval = Duration::new(stored_option.duration().unwrap().into(), 0);
        let one_second = Duration::new(1, 0);

        let mut session = UserSession::new(
            Box::new(|| *timestamp.lock().unwrap()),
            Arc::new(MockStore::new(Some(stored_option))),
        );

        assert!(
            !session.is_session_expired(),
            "The session should not be expired by default",
        );

        session.did_become_inactive();

        *timestamp.lock().unwrap() += timeout_interval - one_second;
        assert!(
            !session.is_session_expired(),
            "The session should not be expired when timeout did not yet passed!"
        );

        *timestamp.lock().unwrap() += one_second;
        assert!(
            session.is_session_expired(),
            "The session should be expired when timeout just passed!"
        );

        *timestamp.lock().unwrap() += one_second;
        assert!(
            session.is_session_expired(),
            "The session should be expired when it is over timeout"
        );
    }
}
