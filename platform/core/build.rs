use std::{path::PathBuf, process};
use std::env;
extern crate cbindgen;

// Based on https://doc.rust-lang.org/cargo/reference/build-scripts.html
// build.js allows running any scripts/code before building the Kernel.
fn main() {
    generate_flatbuffers();
    generate_c_header();
}

fn generate_flatbuffers() {
    // Rebuild flatbuffers everytime there are some changes in flabuffers directory
    println!("cargo:rerun-if-changed=flatbuffers/");

    // This could be refactored to allow running any command,
    // but for now only flatbuffers are generated, and building a more generic solution
    // requires complexity wich may not be needed.

    let path = PathBuf::from("make");

    let mut cmd = process::Command::new(&path);
    cmd.stdin(process::Stdio::null());
    cmd.args(vec!["generate_flatbuffers".to_string()]);

    cmd.spawn()
        .expect("Failed to spawn flatc command")
        .wait()
        .expect("flatc command failed");
}

fn generate_c_header() {
    println!("cargo:rerun-if-changed=c_interface/interface.rs");

    let crate_dir = env::var("CARGO_MANIFEST_DIR").unwrap();

    cbindgen::Builder::new()
      .with_crate(crate_dir)
      .with_language(cbindgen::Language::C)
      .generate()
      .expect("Unable to generate bindings")
      .write_to_file("polypod-core.h");
}
