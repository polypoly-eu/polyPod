import React from "react";
import BasicList from "../../../components/basicList/basicList.jsx";

import {
    anonymizeJsonEntityPath,
    jsonDataEntities,
} from "../../importers/utils/importer-util.js";
import allStructure from "../../../static/allStructure";
import ReportAnalysis from "./report-analysis.js";

export default class MissingKnownJSONFilesAnalysis extends ReportAnalysis {
    get title() {
        return "Missing known JSON files";
    }

    get reportData() {
        return this._missingKnownFileNames;
    }

    _knownJsonFiles() {
        const knownJsonFileNames = allStructure.filter((each) =>
            each.endsWith(".json")
        );
        return knownJsonFileNames.filter(
            (each) =>
                !/^(posts|photos_and_videos)\/album\/[1-9][0-9]?.json$/.test(
                    each
                ) &&
                !/^messages\/(inbox|legacy_threads|message_requests|filtered_threads|archived_threads)\/uniqueid_hash\/message_[2-9][0-9]?.json$/.test(
                    each
                )
        );
    }

    async analyze({ zipFile }) {
        this._missingKnownFileNames = [];
        this.active = true;
        if (!zipFile) return;

        const relevantEntries = await jsonDataEntities(zipFile);
        const anonymizedPaths = relevantEntries.map((entry) =>
            anonymizeJsonEntityPath(entry._path)
        );
        const knownJsonFiles = this._knownJsonFiles();
        this._missingKnownFileNames = knownJsonFiles.filter(
            (each) => !anonymizedPaths.includes(each)
        );
        this.active = this._missingKnownFileNames.length > 0;
    }

    render() {
        return <BasicList items={this._missingKnownFileNames} />;
    }
}
