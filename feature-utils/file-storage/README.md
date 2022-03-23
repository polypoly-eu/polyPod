# Feature File Storage

Module used to access the polypods file system API (poly.out). Has implementation for getting stored file
meta-data and Zip-File access.

## Install and build

Run `npm ci` for installing and `npm run build`

## Usage

Create an instance of FeatureFileStorage after pod has loaded. With it you can use a changeListener, refreshingFiles etc.

For dealing with ZipFiles this includes a ZipFile storing implementation.
