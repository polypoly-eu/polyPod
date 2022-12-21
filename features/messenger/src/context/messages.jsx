import React, { useState, useEffect } from "react";
import { initializeClient } from "../model/matrixClient";
import { Message } from "../model/message";
import { useLocation, useNavigate } from "react-router-dom";

export const MessagesContext = React.createContext();

function updatePodNavigation(pod, location, handleBack) {
    pod.polyNav.actions = {
        back: () => handleBack(),
    };
    pod.polyNav.setActiveActions(location.pathname === "/home" ? [] : ["back"]);
}

export const MessagesContextProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    const [rooms, setRooms] = useState({});
    const [activeRoom, setActiveRoom] = useState(null);
    const [activeMessageThread, setActiveMessageThread] = useState(null);

    const location = useLocation();
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
        updatePodNavigation(pod, location, handleBack);
    }, [location]);

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
