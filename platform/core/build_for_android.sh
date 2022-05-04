#!/bin/bash
set -e    # Exit if any command fails

# ----------------------- Command options ------------------------ #
android_version=24
ndk_version=r22b
build_type=debug
release_flag=""

while [ $# -gt 0 ]; do

   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
   fi

  shift
done

if [[ $build_type == release ]]; then
    release_flag="--release"
fi

# ----------------------- NDK setup ------------------------ #
google_repo=https://dl.google.com/android/repository
ndk_lib=android-ndk-${ndk_version}
android_export=export/android
ndk=${android_export}/NDK
# Override NDK_HOME to point to downloaded version.
# Will be used by `cargo ndk` to generate the libraries
export NDK_HOME=${ndk}/${ndk_lib}

if [ ! -d $NDK_HOME ]; then
	mkdir -p ${android_export}

	echo "*** Installing NDK $ndk_version"
	ndk_download_link=$google_repo/$ndk_lib
	os_name=""
	case "$OSTYPE" in
	    darwin*)
	        os_name=darwin
	    ;;
	    linux*)
	        os_name=linux
	    ;;
	    msys*)
	        os_name=windows
	    ;;
	    cygwin*)
	        os_name=windows
	    ;;
	    *)
	        echo "unsupported OS: $OSTYPE"
	        exit 1
	    ;;
	esac

	ndk_download_link=$google_repo/$ndk_lib-$os_name-x86_64.zip 
	curl -L $ndk_download_link -o ${ndk}.zip
	unzip -d $ndk ${ndk}.zip
	rm ${ndk}.zip;
	echo "*** NDK installed at $NDK_HOME"
fi

# ----------------------- Flatbuffer source files setup ----------------------- #
flatbuffers_lib_source_path=flatbuffers_shared/flatbuffers/java
flatbuffers_lib_copy_path=./PolyPodCoreAndroid/core/src/main

echo "*** Copying flatbuffer source files from $flatbuffers_lib_source_path to $flatbuffers_lib_copy_path"
cp -a $flatbuffers_lib_source_path $flatbuffers_lib_copy_path
echo "*** Done ***"

# ----------------------- Build Core ----------------------- #
target_triples=(aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android)

echo "*** Building Core ***"
cargo install cargo-ndk
for target_triple in ${target_triples[@]}; do
	rustup target add $target_triple
    cargo ndk --platform $android_version --target $target_triple build $release_flag
done
echo "*** Done ***"

# ----------------------- Linking JNI libraries ----------------------- #
architectures=(arm64-v8a armeabi-v7a x86_64 x86)
jni_libs_copy_path=./PolyPodCoreAndroid/core/src/main/jniLibs
libName=libpolypod_core.so

echo "*** Linking JNI libraries with PolyPodCoreAndroid ***"
rm -fr $jni_libs_copy_path
mkdir $jni_libs_copy_path

for idx in "${!target_triples[@]}"; do
  target_triple=${target_triples[$idx]}
  arch=${architectures[$idx]}
  mkdir $jni_libs_copy_path/$arch
  cp target/$target_triple/$build_type/$libName \
	   $jni_libs_copy_path/$arch/$libName
done
echo "*** Done ***"

