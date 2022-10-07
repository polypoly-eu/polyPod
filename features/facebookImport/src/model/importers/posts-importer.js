import MultipleFilesImporter from "./multiple-files-importer";

export default class PostsImporter extends MultipleFilesImporter {
    _isTargetPostFile(entryName) {
        return /posts\/your_posts_[1-9][0-9]?.json$/.test(entryName);
    }

    _importRawDataResults(facebookAccount, dataResults) {
        dataResults.forEach((rawPosts) => {
            const postsWithTimestamp = rawPosts.map((postData) => {
                return { timestamp: postData.timestamp };
            });
            facebookAccount.addPosts(postsWithTimestamp);
        });
    }
}

PostsImporter.STORAGE_KEY = "posts";
