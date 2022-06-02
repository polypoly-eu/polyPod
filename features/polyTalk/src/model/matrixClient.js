import { Room } from "./room";
import { Message } from "./message";

class MatrixStub {
    createClient() {
        const handlers = {};
        return {
            once(command) {
                if (command !== "sync") throw `Unknown command: ${command}`;
                return { state: "PREPARED" };
            },
            on(event, handler) {
                handlers[event] = handler;
            },
            startClient() {
                return Object.entries({
                    "pm-with-alfred": [
                        {
                            sender: "self",
                            content: "Hi Alfred, what's up?",
                            time: "Thu Jun 02 2022 14:59:30 GMT+0200 (Central European Summer Time)",
                        },
                        {
                            sender: "Alfred",
                            content: "Hello who is this please?",
                            time: "Thu Jun 02 2022 15:01:30 GMT+0200 (Central European Summer Time)",
                        },
                        {
                            sender: "Alfred",
                            content: "Hello???",
                            time: "Thu Jun 02 2022 15:15:30 GMT+0200 (Central European Summer Time)",
                        },
                        {
                            sender: "self",
                            content: "Hello",
                            time: "Thu Jun 02 2022 15:18:30 GMT+0200 (Central European Summer Time)",
                        },
                        {
                            sender: "Alfred",
                            content: "Hello...",
                            time: "Thu Jun 02 2022 15:20:30 GMT+0200 (Central European Summer Time)",
                        },
                    ],
                }).forEach(function ([room, messages]) {
                    messages.forEach(function ({ sender, content, time }) {
                        handlers["Room.timeline"]?.(
                            {
                                getType: () => "m.room.message",
                                getSender: () => sender,
                                getContent: () => ({ body: content }),
                                getTime: () => time,
                            },
                            { name: room },
                            false
                        );
                    });
                });
            },
        };
    }
}

const matrix = window.pod.matrix || new MatrixStub();

function findOrCreateRoom(rooms, name) {
    if (!(name in rooms)) rooms[name] = new Room(name);
    return rooms[name];
}

export async function initializeClient(rooms, setRooms) {
    const client = matrix.createClient("https://matrix.polypoly.tech");
    client.on("Room.timeline", function (event, room, toStartOfTimeline) {
        if (event.getType() !== "m.room.message") {
            return; // only use messages
        }
        findOrCreateRoom(rooms, room.name).addMessage(
            new Message({
                message: event.getContent().body,
                sender: event.getSender(),
            })
        );
        setRooms({ ...rooms });
    });
    await client.startClient({ initialSyncLimit: 10 });
    const { state, prevState, res } = await client.once("sync");
    if (state !== "PREPARED")
        throw `Failed to initialise Matrix client, state is ${state}`;
};
