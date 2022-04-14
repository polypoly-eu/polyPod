import { relevantZipEntries } from "../../importers/utils/importer-util";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

/**
 * Minimum number of picutures that should be present in
 * the export in order for this analysis to be active.
 */
const PICTURES_THRESHOLD = 1;

export default class AboutPicturesDataAnalysis extends RootAnalysis {
    /**
     * Determine the pictures posted by the user.
     *
     * At the moment, since we do not import posts and albums,
     * we count only the number of picture files posted by the
     * user. For that we look in a list of folders where user
     * pictures are saved. Depending on the export, posted pictures
     * are exported in one of two folders:
     *   - "photos_and_videos"
     *   - "posts/media"
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
        const photoRegexes = [
            /^photos_and_videos\/(.+)\.(jpg|jpeg)$/i,
            /^posts\/media\/(.+)\.(jpg|jpeg)$/i,
        ];
        return (await relevantZipEntries(zipFile))
            .map((entry) => entry.path)
            .filter((path) => photoRegexes.some((regex) => regex.test(path)));
    }

    async analyze({ zipFile, dataAccount }) {
        const pictureEntries = await this._userPicturesFromExport(zipFile);
        if (pictureEntries.length >= PICTURES_THRESHOLD)
            dataAccount.analyses.picturesCount = pictureEntries.length;
    }
}
