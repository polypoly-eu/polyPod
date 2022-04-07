import React from "react";
import BasicList from "../../../components/basicList/basicList.jsx";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class ImportedJsonFilesAnalysis extends RootAnalysis {
    get title() {
        return "Imported files";
    }

    async analyze({ dataAccount }) {
        this._importedFileNames = dataAccount.importedFileNames;
        this.active = this._importedFileNames.length > 0;
    }

    renderSummary() {
        return `We imported ${this._importedFileNames.length} files.`;
    }

    renderDetails() {
        return <BasicList items={this._importedFileNames} />;
    }
}
