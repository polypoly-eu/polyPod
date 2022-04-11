import { useContext } from "react";
import { PolyImportContext } from "../../../../src/react-components";

const mockPolyImportComponent = () => {
  const { files, account, handleRemoveFile, refreshFilesf } =
    useContext(PolyImportContext);

  return "";
};
export default mockPolyImportComponent;
