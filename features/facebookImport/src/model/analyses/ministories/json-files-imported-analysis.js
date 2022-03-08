import React from "react";
import BasicList from "../../../components/basicList/basicList.jsx";
import RootAnalysis from "./root-analysis.js";

export default class ImportedJsonFilesAnalysis extends RootAnalysis {
    get title() {
        return "Imported files";
    }

    async analyze({ facebookAccount }) {
        this._importedFileNames = facebookAccount.importedFileNames;
        this.active = this._importedFileNames.length > 0;
    }

    renderSummary() {
        return `We imported ${this._importedFileNames.length} files.`;
    }

    renderDetails() {
        return <BasicList items={this._importedFileNames} />;
    }
}
