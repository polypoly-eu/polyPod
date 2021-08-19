import { v4 as uuidv4 } from "uuid";
const namespace = "http://polypoly.coop/schema/fbImport/";

class ModelEntity {
    constructor() {
        this.uuid = uuidv4();
    }

    set uuid(uuid) {
        this._uuid = uuid;
    }

    get uuid() {
        return this._uuid;
    }

    set zipFileId(zipFileId) {
        this._zipFileId = zipFileId;
    }

    get zipFileId() {
        return this._zipFileId;
    }

    rdfSubject() {
        return `${namespace}${this.uuid}`;
    }

    _identifierQuad(dataFactory) {
        return dataFactory.quad(
            dataFactory.namedNode(this.rdfSubject()),
            dataFactory.namedNode("http://schema.org/identifier"),
            dataFactory.literal(this.uuid)
        );
    }

    _zipFileIdQuad(dataFactory) {
        return dataFactory.quad(
            dataFactory.namedNode(this.rdfSubject()),
            dataFactory.namedNode(`${namespace}zipFileId`),
            dataFactory.literal(this.zipFileId)
        );
    }

    _resourceTypeQuad(dataFactory) {
        return dataFactory.quad(
            dataFactory.namedNode(this.rdfSubject()),
            dataFactory.namedNode(
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
            ),
            dataFactory.literal(this.constructor.name)
        );
    }

    exportRDFTriples(pod) {
        const { dataFactory, polyIn } = pod;
        polyIn.add(this._identifierQuad(dataFactory));
        polyIn.add(this._zipFileIdQuad(dataFactory));
        polyIn.add(this._resourceTypeQuad(dataFactory));
    }
}

class OffFacebookEntity extends ModelEntity {
    set name(entityName) {
        this._name = entityName;
    }

    get name() {
        return this._name;
    }

    get events() {
        return this._events;
    }

    set events(events) {
        this._events = events;
    }

    _nameQuad(dataFactory) {
        return dataFactory.quad(
            dataFactory.namedNode(this.rdfSubject()),
            dataFactory.namedNode(`${namespace}name`),
            dataFactory.literal(this.name)
        );
    }

    exportRDFTriples(pod) {
        const { dataFactory, polyIn } = pod;

        super.exportRDFTriples(pod);
        if (this.name) {
            polyIn.add(this._nameQuad(dataFactory));
        }
        for (const event of this.events) {
            event.exportRDFTriples(pod);
        }
    }
}

class OffFacebookEvent extends ModelEntity {
    set timestamp(timestamp) {
        this._eventId = timestamp;
    }

    get timestamp() {
        return this._timestamp;
    }

    set eventId(eventId) {
        this._eventId = eventId;
    }

    get eventId() {
        return this._eventId;
    }

    set type(type) {
        this._type = type;
    }

    get type() {
        return this._type;
    }

    set offFacebookEntity(entity) {
        this._offFacebookEntity = entity;
    }

    get offFacebookEntity() {
        return this._offFacebookEntity;
    }

    _eventIdQuad(dataFactory) {
        return dataFactory.quad(
            dataFactory.namedNode(this.rdfSubject()),
            dataFactory.namedNode(`${namespace}eventId`),
            dataFactory.literal(this.eventId)
        );
    }

    _typeQuad(dataFactory) {
        return dataFactory.quad(
            dataFactory.namedNode(this.rdfSubject()),
            dataFactory.namedNode(`${namespace}type`),
            dataFactory.literal(this.type)
        );
    }

    _timestampQuad(dataFactory) {
        return dataFactory.quad(
            dataFactory.namedNode(this.rdfSubject()),
            dataFactory.namedNode(`${namespace}timestamp`),
            dataFactory.literal(this.timestamp)
        );
    }

    _offFacebookEntityQuad(dataFactory) {
        return dataFactory.quad(
            dataFactory.namedNode(this.rdfSubject()),
            dataFactory.namedNode(`${namespace}offFacebookEntity`),
            dataFactory.namedNode(this.offFacebookEntity.rdfSubject())
        );
    }

    exportRDFTriples(pod) {
        const { dataFactory, polyIn } = pod;

        super.exportRDFTriples(pod);
        if (this.eventId) {
            polyIn.add(this._eventIdQuad(dataFactory));
        }
        if (this.type) {
            polyIn.add(this._typeQuad(dataFactory));
        }
        if (this.timestamp) {
            polyIn.add(this._timestampQuad(dataFactory));
        }
        if (this.eventId) {
            polyIn.add(this._eventIdQuad(dataFactory));
        }
    }
}

class FacebookAccount extends ModelEntity {
    constructor(pod) {
        super();
        this._pod = pod;
    }

    get pod() {
        return this._pod;
    }
}

export { FacebookAccount, OffFacebookEvent, OffFacebookEntity };
