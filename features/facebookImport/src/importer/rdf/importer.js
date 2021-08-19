import { ZipFile } from "../../model/storage.js";
import { OffFacebookEvent, OffFacebookEntity } from "../model";

class DataImporter {
    get importStatus() {
        return this._importStatus;
    }

    set importStatus(status) {
        this._importStatus = status;
    }

    async _readJSONFile(dataFileName, zipFile) {
        const entries = await zipFile.getEntries();
        const offFacebookEventsFile = entries.find((entryName) =>
            entryName.includes(dataFileName)
        );
        if (!offFacebookEventsFile) {
            this.importStatus = "Missing File";
            return;
        }
        const fileContent = new TextDecoder("utf-8").decode(
            await zipFile.getContent(offFacebookEventsFile)
        );

        if (!fileContent) {
            this.importStatus = "Missing Content";
            return;
        }
        try {
            return JSON.parse(fileContent);
        } catch (exception) {
            //TODO: better error handling + error reporting
            console.log(exception);
            this.importStatus = "JSON parsing error";
            return;
        }
    }

    async _readJSONDataArray(dataFileName, dataKey, zipFile) {
        const rawData = await this._readJSONFile(dataFileName, zipFile);
        if (!(dataKey in rawData)) {
            this.importStatus = `Missing ${dataKey} key`;
            return;
        }

        const arrayData = rawData[dataKey];
        if (!Array.isArray(arrayData)) {
            this.importStatus = `Wrong data format for ${dataKey} key`;
            return;
        }
        return arrayData;
    }
}

class OffFacebookEventsImporter extends DataImporter {
    _createEvent(eventData, zipFileId, offFacebookEntity) {
        const offFacebookEvent = new OffFacebookEvent();
        offFacebookEvent.zipFileId = zipFileId;
        offFacebookEvent.offFacebookEntity = offFacebookEntity;
        offFacebookEvent.eventId = eventData.eventId;
        offFacebookEvent.type = eventData.type;
        offFacebookEvent.timestamp = eventData.timestamp;
        return offFacebookEvent;
    }

    _createEntity(offFacebookEntityData, zipFileId) {
        const offFacebookEntity = new OffFacebookEntity();
        offFacebookEntity.zipFileId = zipFileId;
        offFacebookEntity.name = offFacebookEntityData?.name;

        const offFacebookEvents = offFacebookEntityData.events.map(
            (eventData) =>
                this._createEvent(eventData, zipFileId, offFacebookEntity)
        );
        offFacebookEntity.events = offFacebookEvents;
        return offFacebookEntity;
    }

    async import({ id, zipFile }, pod) {
        const eventsData = await this._readJSONDataArray(
            "apps_and_websites_off_of_facebook/your_off-facebook_activity.json",
            "off_facebook_activity_v2",
            zipFile
        );

        const offFacebookEntities = eventsData.map((offFacebookEntityData) =>
            this._createEntity(offFacebookEntityData, id)
        );
        debugger;
        for (const entity in offFacebookEntities) {
            entity.exportRDFTriples(pod);
        }
    }
}

const importers = [OffFacebookEventsImporter];

export async function importData(file) {
    const zipFile = new ZipFile(file, window.pod);
    const enrichedFile = { ...file, zipFile };
    const executedImporters = await Promise.all(
        importers.map(async (importerClass) => {
            const importer = new importerClass();
            await importer.import(enrichedFile, window.pod);
            return importer;
        })
    );
}
