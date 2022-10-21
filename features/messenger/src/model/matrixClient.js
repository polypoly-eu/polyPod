import { Room } from "./room";
import { Message } from "./message";
import exampleData from "../exampleData";

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
                return Object.entries(exampleData).forEach(function ([
                    room,
                    messages,
                ]) {
                    messages.forEach(function ({ sender, content, date }) {
                        handlers["Room.timeline"]?.(
                            {
                                getType: () => "m.room.message",
                                getSender: () => sender,
                                getContent: () => ({ body: content }),
                                getDate: () => new Date(date),
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
                sender: event.getSender(),
                message: event.getContent().body,
                date: event.getDate(),
            })
        );
        setRooms({ ...rooms });
    });
    await client.startClient({ initialSyncLimit: 10 });
    const { state, prevState, res } = await client.once("sync");
    if (state !== "PREPARED")
        throw `Failed to initialise Matrix client, state is ${state}`;
}
