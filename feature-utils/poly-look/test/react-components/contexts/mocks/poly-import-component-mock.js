import React, { useContext } from "react";
import { PolyImportContext } from "../../../../src/react-components";

const MockPolyImportComponent = () => {
  const { files, account, handleRemoveFile, refreshFiles } =
    useContext(PolyImportContext);
  console.log("Component print: ", files);
  return (
    <div>
      {files?.map((fileName, id) => (
        <p key={id}>{fileName}</p>
      ))}
    </div>
  );
};
export default MockPolyImportComponent;
