import React from "react";
import RootAnalysis from "./root-analysis.js";

export default class ImportedJsonFilesAnalysis extends RootAnalysis {
    get title() {
        return "Imported files";
    }

    async analyze({ facebookAccount }) {
        this._importedFileNames = facebookAccount.importedFileNames;
        this.active = this._importedFileNames.length > 0;
    }

    render() {
        if (!this.active) {
            return "No Imported Files!";
        }
        return (
            <ul>
                {this._importedFileNames.map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>
        );
    }
}
