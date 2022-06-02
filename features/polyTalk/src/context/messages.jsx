import React, { useState } from "react";
import { MessageThread } from "../model/messageThread";
import { MessageClass } from "../model/message";

export const MessagesContext = React.createContext();

function loadMatrixMessageThreads() {
    return [
        new MessageThread([
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
        ]),
    ];
}

export const MessagesContextProvider = ({ children }) => {
    const [threads, setThreads] = useState(loadMatrixMessageThreads());

    return (
        <MessagesContext.Provider value={{ threads, setThreads }}>
            {children}
        </MessagesContext.Provider>
    );
};

export default MessagesContextProvider;
