# PolyPodCore crates

This folder contains all of the sub component crates which do make up the PolyPodCore.

## Structure

- [common](common): Contains the shared functionality among all of the crates.
- [failure](failure): Contains the unified core failure which represents all of the possible failures that can occur in the Rust core.
- [feature](feature): Contains the functionalities specific for a PolyPod feature.
- [feature_categories](feature_categories): Contains the functionality of loading and processing the feature categories.
- [io](io): Contains the IO specific operations.
- [preferences](preferences): Contains the functionality for the Preferences storage.
- [user_session](user_session): Contains the functionality related to managing the user session.
- [update_notification](update_notification): Contains the logic for showing update notifications to the user.
