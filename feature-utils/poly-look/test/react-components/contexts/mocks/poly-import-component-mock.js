import React, { useContext } from "react";
import { PolyImportContext } from "../../../../src/react-components";

const MockPolyImportComponent = () => {
  const { files, account, handleRemoveFile, refreshFiles } =
    useContext(PolyImportContext);
  return (
    <div>
      {files?.map((fileName, id) => (
        <p key={id}>{fileName}</p>
      ))}
    </div>
  );
};
export default MockPolyImportComponent;
