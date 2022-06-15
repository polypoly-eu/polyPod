# Feature File Storage

Module used to access the polypods file system API (polyOut). Has implementation for getting stored file
meta-data and Zip-File access.

## Install and build

Run `npm ci` for installing and `npm run build`

## Usage

Create an instance of FeatureFileStorage after pod has loaded. With it you can use a changeListener, refreshingFiles etc.

For dealing with ZipFiles this includes a ZipFile storing implementation.

Create an instance of Importer in the feature's local importer file to manage the importers, import files from a ZipFile and load them to a feature-Account (i.e. FacebookAccount).