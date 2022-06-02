import React, { useState } from "react";
import { MessageRoom } from "../model/messageThread";
import { MessageClass } from "../model/message";

export const MessagesContext = React.createContext();

function loadMatrixMessageRooms() {
    return [
        new MessageRoom(
            [
                new MessageClass({
                    message: "Hi Alfred whats up?",
                    direction: "outgoing",
                    time: "Thu Jun 02 2022 14:59:30 GMT+0200 (Central European Summer Time)",
                }),
                new MessageClass({
                    message: "Hello who is this please?",
                    time: "Thu Jun 02 2022 15:01:30 GMT+0200 (Central European Summer Time)",
                    sender: "Alfred",
                }),
                new MessageClass({
                    message: "Hello???",
                    time: "Thu Jun 02 2022 15:15:30 GMT+0200 (Central European Summer Time)",
                    sender: "Alfred",
                }),
                new MessageClass({
                    message: "Hello",
                    time: "Thu Jun 02 2022 15:18:30 GMT+0200 (Central European Summer Time)",
                }),
                new MessageClass({
                    message: "Hello...",
                    time: "Thu Jun 02 2022 15:20:30 GMT+0200 (Central European Summer Time)",
                    sender: "Alfred",
                }),
            ],
            ["Alfred"]
        ),
    ];
}

export const MessagesContextProvider = ({ children }) => {
    const [rooms, setRooms] = useState(loadMatrixMessageRooms());

    return (
        <MessagesContext.Provider value={{ rooms, setRooms }}>
            {children}
        </MessagesContext.Provider>
    );
};

export default MessagesContextProvider;
