import React, { useState, useEffect } from "react";
import { Room } from "../model/room";
import { Message } from "../model/message";
import { useHistory } from "react-router-dom";

export const MessagesContext = React.createContext();

const matrix = window.pod.matrix || {
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
    },
};

function findOrCreateRoom(rooms, name) {
    if (!(name in rooms)) rooms[name] = new Room(name);
    return rooms[name];
}

async function initializeClient(rooms, setRooms) {
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
}

function updatePodNavigation(pod, history, handleBack) {
    pod.polyNav.actions = {
        back: () => handleBack(),
    };
    history.length > 1
        ? pod.polyNav.setActiveActions(["back"])
        : pod.polyNav.setActiveActions([]);
}

export const MessagesContextProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    const [rooms, setRooms] = useState({});
    const [activeRoom, setActiveRoom] = useState(null);

    const history = useHistory();

    const handleSelectRoom = (room) => {
        setActiveRoom(room);
        history.push("/room");
    };

    const handleBack = () => {
        history.goBack();
    };

    const initPod = async () => await window.pod;

    //on startup
    useEffect(() => {
        initPod().then((newPod) => {
            setPod(newPod);
            initializeClient(rooms, setRooms);
        });
    }, []);

    useEffect(() => {
        if (!pod) return;
        updatePodNavigation(pod, history, handleBack);
    });

    return (
        <MessagesContext.Provider
            value={{ rooms, handleSelectRoom, handleBack, activeRoom }}
        >
            {children}
        </MessagesContext.Provider>
    );
};

export default MessagesContextProvider;
