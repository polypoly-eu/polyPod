async function parseMessages(entry) {
    const content = await entry.getContent();
    const text = await new TextDecoder("utf-8").decode(content);
    // TODO
    return {};
}

export default class MessagesImporter {
    async import({ zipFile, facebookAccount: whatsAppAccount }) {
        const entries = await zipFile.getEntries();
        const messageEntries = entries.filter(({ path }) =>
            matchRegex(path, this)
        );
        whatsAppAccount.activities.push(
            ...(
                await Promise.all(
                    messageEntries.map((entry) => parseMessages(entry))
                )
            ).flat()
        );
    }
}
