import { createMockedZip } from "../utils/data-creation";
export const DATASET_EXPECTED_VALUES = {
    numberOfMessageThreads: 2,
    numberOfMessages: 7,
};

export function createMessageThreadOneData() {
    return {
        participants: [{ name: "Duffy Duck" }, { name: "John Doe" }],
        title: "Duffy Duck",
        is_still_participant: true,
        thread_type: "Regular",
        thread_path: "inbox/duffyduck_2jzaxws1kg",
        magic_words: [],
        messages: [
            {
                sender_name: "John Doe",
                timestamp_ms: 1464365061323,
                content: "First message",
                type: "Generic",
                is_unsent: false,
            },

            {
                sender_name: "John Doe",
                timestamp_ms: 1462615596454,
                content: "Second message",
                type: "Generic",
                is_unsent: false,
            },

            {
                sender_name: "John Doe",
                timestamp_ms: 1462031878036,
                content: "Third message",
                type: "Generic",
                is_unsent: false,
            },

            {
                sender_name: "Duffy Duck",
                timestamp_ms: 1462029860538,
                content: "Second message",
                type: "Generic",
                is_unsent: false,
            },
        ],
    };
}

export function createMessageThreadTwoData() {
    return {
        participants: [{ name: "Jane Doe" }, { name: "John Doe" }],
        title: "Jane Doe",
        is_still_participant: true,
        thread_type: "Regular",
        thread_path: "inbox/janedoe_h63g35dgdha",
        magic_words: [],
        messages: [
            {
                sender_name: "Jane Doe",
                timestamp_ms: 1564365061323,
                content: "First message",
                type: "Generic",
                is_unsent: false,
            },

            {
                sender_name: "John Doe",
                timestamp_ms: 1562613246454,
                content: "Second message",
                type: "Generic",
                is_unsent: false,
            },

            {
                sender_name: "Jane Doe",
                timestamp_ms: 1562331878036,
                content: "Jane called you.",
                call_duration: 2877,
                type: "Call",
                is_unsent: false,
            },
        ],
    };
}

function createPathForThread(messageThread) {
    return `messages/${messageThread.thread_path}/message_1.json`;
}

export function zipFileWithMessageThreads() {
    const messageThreadOne = createMessageThreadOneData();
    const messageThreadTwo = createMessageThreadTwoData();
    return createMockedZip([
        [createPathForThread(messageThreadOne), messageThreadOne],
        [createPathForThread(messageThreadTwo), messageThreadTwo],
    ]);
}
