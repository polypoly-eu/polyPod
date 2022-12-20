import React, { createContext, useContext, useEffect, useState } from "react";
import {
  RefreshFilesError,
  FeatureFileStorage,
  ZipFile,
} from "@polypoly-eu/poly-import";

// used until real storage is loaded
const fakeStorage = {
  files: null,
  refreshFiles: async () => null,
  readFile: async () => null,
  removeFile: async () => {},
};

/**
 * Created by {@link PolyImportProvider}, this context object provides
 * access to `files`, `account`, `handleRemoveFile` and
 * `refreshFiles`.
 *
 * @function
 */
export const PolyImportContext = createContext();

/**
 * Provides the basic functionality of all data importer Features: It
 * reads archive files containing raw data from the file system, runs
 * the provided data importers against that data, and stores the
 * results in an account object.
 *
 * @function
 * @param {JSX.Element} props.children - The elements to render with
 * this context.
 * @param {Object} props.parentContext - The context used to access
 * `pod`, `setIsLoading` and `setGlobalError`.
 * @param {Object[]} props.dataImporters - A list of importer classes
 * to run against any imported files.
 * @param {Object} props.DataAccount - The account class to store data
 * into.
 * @returns {JSX.Element} The supplied children, with access to {@link
 * PolyImportContext}.
 */
export const PolyImportProvider = ({
  children,
  parentContext,
  dataImporters,
  DataAccount,
}) => {
  const { pod, setIsLoading, setGlobalError } = useContext(parentContext);

  const [storage, setStorage] = useState(fakeStorage);
  const [files, setFiles] = useState(null);
  const [account, setAccount] = useState(null);

  function refreshFiles() {
    setIsLoading(true);
    storage
      .refreshFiles()
      .then(async () => {
        if (!storage.files) {
          setFiles(null);
          return;
        }
        const resolvedFiles = await Promise.all(storage.files);
        setFiles(resolvedFiles);
        setIsLoading(false);
      })
      .catch((error) => setGlobalError(new RefreshFilesError(error)));
  }

  const handleRemoveFile = (fileID) => {
    setAccount(null);
    return storage.removeFile(fileID);
  };

  useEffect(() => {
    if (!pod) return;
    const storage = new FeatureFileStorage(pod, async () => {
      const resolvedFiles = await Promise.all(storage.files);
      setFiles(resolvedFiles);
    });
    setStorage(storage);
  }, [pod]);

  //on storage change
  useEffect(() => {
    refreshFiles();
  }, [storage]);

  //on file change
  //when files changed run the importer first and create an account model first.
  //after there is an account the analyses are triggered.
  useEffect(async () => {
    if (!files?.[0]) return;
    const zipFile = await ZipFile.createWithCache(files[0], pod);
    setAccount(
      await new DataAccount().import({
        importers: dataImporters,
        zipFile,
        pod,
      })
    );
  }, [files]);

  return (
    <PolyImportContext.Provider
      value={{
        files,
        account,
        handleRemoveFile,
        refreshFiles,
      }}
    >
      {children}
    </PolyImportContext.Provider>
  );
};
