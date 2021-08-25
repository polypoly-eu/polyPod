import { readJSONDataArray } from "../../importer-util";
import { OffFacebookEvent, OffFacebookEntity } from "../model";

export default class OffFacebookEventsRdfImporter {
    _createEvent(eventData, zipFileId, offFacebookEntity) {
        const offFacebookEvent = new OffFacebookEvent();
        offFacebookEvent.zipFileId = zipFileId;
        offFacebookEvent.offFacebookEntity = offFacebookEntity;
        offFacebookEvent.eventId = eventData.id;
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

    async import({ id, zipFile }, facebookAccount, pod) {
        const fileName =
            "apps_and_websites_off_of_facebook/your_off-facebook_activity.json";
        const eventsData = await readJSONDataArray(
            fileName,
            "off_facebook_activity_v2",
            zipFile
        );
        facebookAccount.addImportedFileName(fileName);

        const offFacebookEntities = eventsData.map((offFacebookEntityData) =>
            this._createEntity(offFacebookEntityData, id)
        );

        for (const entity of offFacebookEntities) {
            entity.exportRDFTriples(pod);
        }
    }
}
