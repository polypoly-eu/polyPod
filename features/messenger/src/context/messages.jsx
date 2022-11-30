import React, { useState, useEffect } from "react";
import { initializeClient } from "../model/matrixClient";
import { Message } from "../model/message";
import { useNavigate } from "react-router-dom";

export const MessagesContext = React.createContext();

function updatePodNavigation(pod, navigate, handleBack) {
    pod.polyNav.actions = {
        back: () => handleBack(),
    };
    navigate > 1
        ? pod.polyNav.setActiveActions(["back"])
        : pod.polyNav.setActiveActions([]);
}

export const MessagesContextProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    const [rooms, setRooms] = useState({});
    const [activeRoom, setActiveRoom] = useState(null);
    const [activeMessageThread, setActiveMessageThread] = useState(null);

    const navigate = useNavigate();

    const handleSelectRoom = (room) => {
        setActiveRoom(room);
        setActiveMessageThread(room.messages);
        navigate("/room");
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleSendMessage = (message) => {
        // TODO: Don't fake this
        activeRoom.addMessage(
            new Message({ message: message, date: new Date(), sender: "self" })
        );
        setActiveMessageThread([...activeRoom.messages]);
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
        updatePodNavigation(pod, navigate, handleBack);
    });

    return (
        <MessagesContext.Provider
            value={{
                rooms,
                handleSelectRoom,
                handleBack,
                activeRoom,
                activeMessageThread,
                handleSendMessage,
            }}
        >
            {children}
        </MessagesContext.Provider>
    );
};

export default MessagesContextProvider;
