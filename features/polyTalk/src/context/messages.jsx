import React, { useState, useEffect } from "react";
import { initializeClient } from "../model/matrixClient";
import { Message } from "../model/message";
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

    const handleSendMessage = (message) => {
        // TODO: Don't fake this
        activeRoom.addMessage(
            new Message({ message: message, date: new Date(), sender: "self" })
        );
        setActiveRoom({ ...activeRoom });
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
            value={{
                rooms,
                handleSelectRoom,
                handleBack,
                activeRoom,
                handleSendMessage,
            }}
        >
            {children}
        </MessagesContext.Provider>
    );
};

export default MessagesContextProvider;
