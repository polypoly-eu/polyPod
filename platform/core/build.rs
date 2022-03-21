use std::{path::PathBuf, process};

// Based on https://doc.rust-lang.org/cargo/reference/build-scripts.html
// build.js allows running any scripts/code before building the Kernel.
fn main() {
    generate_flatbuffers();
}

fn generate_flatbuffers() {
    // Rebuild flatbuffers everytime there are some changes in flabuffers directory
    println!("cargo:rerun-if-changed=flatbuffers/");

    // This could be refactored to allow running any command,
    // but for now only flatbuffers are generated, and building a more generic solution
    // requires complexity which may not be needed.

    let path = PathBuf::from("./generate_flatbuffers.sh");

    let mut cmd = process::Command::new(&path);
    cmd.stdin(process::Stdio::null());

    cmd.spawn()
        .expect("Failed to spawn flatc command")
        .wait()
        .expect("flatc command failed");
}
