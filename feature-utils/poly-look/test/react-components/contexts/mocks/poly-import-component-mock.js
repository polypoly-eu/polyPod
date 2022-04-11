import React, { useContext } from "react";
import { PolyImportContext } from "../../../../src/react-components";

const MockPolyImportComponent = () => {
  const { files, account, handleRemoveFile, refreshFiles } =
    useContext(PolyImportContext);
  // console.log(files, account, handleRemoveFile, refreshFiles);
  return <div></div>;
};
export default MockPolyImportComponent;
