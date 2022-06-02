import React, { useState, useEffect } from "react";
import { MessageRoom } from "../model/messageThread";
import { MessageClass } from "../model/message";
import { useHistory } from "react-router-dom";

export const MessagesContext = React.createContext();

function updatePodNavigation(pod, history, handleBack) {
    pod.polyNav.actions = {
        back: () => handleBack(),
    };
    history.length > 1
        ? pod.polyNav.setActiveActions(["back"])
        : pod.polyNav.setActiveActions([]);
}

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
    const [pod, setPod] = useState(null);
    const [rooms, setRooms] = useState(loadMatrixMessageRooms());
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
