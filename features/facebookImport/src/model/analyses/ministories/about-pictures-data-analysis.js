import React from "react";
import {
    relevantZipEntries,
    removeEntryPrefix,
} from "../../importers/utils/importer-util";
import RootAnalysis from "./root-analysis";

import PicturesMiniStory from "../../../components/picturesMiniStory/picturesMiniStory.jsx";

import i18n from "../../../i18n";

/**
 * Minimum number of picutures that should be present in
 * the export in order for this analysis to be active.
 */
const PICTURES_THRESHOLD = 1;

export default class AboutPicturesDataAnalysis extends RootAnalysis {
    get label() {
        return RootAnalysis.Labels.NONE;
    }

    get title() {
        return i18n.t("picturesMiniStory:title");
    }

    /**
     * Determine the pictures posted by the user.
     *
     * At the moment, since we do not import posts and albums,
     * we count only the number of picture files in the folder
     * "photos_and_videos" where posted pictures are exported.
     *
     * Depending on the export that folder might contain also
     * other picture files like "emptyalbum.png" which was not
     * uploaded by a user, but most likely added by Facebook.
     *
     * Also some folders like "thumbnails" indicate that pictures
     * there are created from other pictures.
     *
     * For now we do not try to distinguish them from pictures
     * uploaded by a user, or do any other classification. We
     * simply include all pictures in that folder.
     */
    async _userPicturesFromExport(zipFile) {
        const relevantEntries = await relevantZipEntries(zipFile);
        return relevantEntries.filter((zipEntry) =>
            /^photos_and_videos\/(.+)\.(jpg|jpeg)$/.test(
                removeEntryPrefix(zipEntry)
            )
        );
    }

    async analyze({ zipFile }) {
        const pictureEntries = await this._userPicturesFromExport(zipFile);
        this._picturesCount = pictureEntries.length;
        this.active = this._picturesCount >= PICTURES_THRESHOLD;
    }

    renderSummary() {
        return <PicturesMiniStory />;
    }
}
