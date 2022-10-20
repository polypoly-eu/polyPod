import MultipleFilesImporter from "./multiple-files-importer";

export default class PostsImporter extends MultipleFilesImporter {
    _isTargetPostFile(entryName) {
        return /posts\/your_posts_[1-9][0-9]?.json$/.test(entryName);
    }

    _processRawDataResults(dataResults) {
        return dataResults
            .map((rawPosts) =>
                rawPosts.map((postData) => ({
                    timestamp: postData.timestamp,
                }))
            )
            .flat();
    }
}

PostsImporter.STORAGE_KEY = "posts";
