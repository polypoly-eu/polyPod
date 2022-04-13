import React, { useContext } from "react";
import { PolyImportContext } from "../../../../src/react-components";

const MockPolyImportComponent = () => {
  const { files, account, handleRemoveFile, refreshFiles } =
    useContext(PolyImportContext);

  const handleRemoveFiles = () => {
    for (let file of files) {
      handleRemoveFile(file);
    }
  };
  return (
    <div>
      {files?.map((fileName, id) => (
        <p key={id}>{fileName}</p>
      ))}
      <button
        className="removeFiles"
        onClick={() => handleRemoveFiles()}
      ></button>
    </div>
  );
};
export default MockPolyImportComponent;
