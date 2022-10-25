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

export const PolyImportContext = createContext();

/**
 * It takes a list of files, runs them through a list of importers, and returns an account.
 * @const
 * @callback PolyImportProvider
 * @param {Object} props
 * @param {Object} props.children
 * @param {Object} props.parentContext
 * @param {Object} props.dataImporters
 * @param {Object} props.DataAccount
 * @returns A function that returns a component.
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
