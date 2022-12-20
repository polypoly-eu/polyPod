import { relevantZipEntries } from "../../importers/utils/importer-util";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys";

/**
 * Minimum number of picutures that should be present in
 * the export in order for this analysis to be active.
 * @const PICTURES_THRESHOLD 1
 */
const PICTURES_THRESHOLD = 1;

/**
 * It takes a zip file and a data account, and if the zip file contains more than a certain number of
 * pictures, it adds a key to the data account's analyses object.
 * @class AboutPicturesDataAnalysis
 */
export default class AboutPicturesDataAnalysis extends RootAnalysis {
    /**
     * It takes a zip file, finds all the files in it that look like they might be photos, and returns a
     * list of those files.
     * 
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

     * @memberof AboutPicturesDataAnalysis
     * @param zipFile - The zip file that was uploaded by the user.
     * @returns An array of paths to the photos in the zip file.
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

    /**
     * It takes a zip file and a data account, and if the zip file contains more than a certain number of
     * pictures, it adds a key to the data account's analyses object.
     * @param zipFile - The zip file that was uploaded by the user.
     * @param dataAccount - The data account of the user.
     * @memberof AboutPicturesDataAnalysis
     */
    async analyze({ zipFile, dataAccount }) {
        const pictureEntries = await this._userPicturesFromExport(zipFile);
        if (pictureEntries.length >= PICTURES_THRESHOLD)
            dataAccount.analyses[analysisKeys.picturesCount] =
                pictureEntries.length;
    }
}
