import React, { useContext } from "react";
import { Screen } from "@polypoly-eu/poly-look";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationList, Conversation } from "@chatscope/chat-ui-kit-react";
import { MessagesContext } from "../context/messages.jsx";

const Home = () => {
    const { rooms, handleSelectRoom } = useContext(MessagesContext);

    return (
        <Screen className="poly-theme-light">
            <ConversationList>
                {rooms.map((room, i) => (
                    <Conversation
                        key={i}
                        name={room.participants[0]}
                        lastSenderName={room.lastMessage.sender}
                        info={room.lastMessage.message}
                        onClick={() => handleSelectRoom(room)}
                    ></Conversation>
                ))}
            </ConversationList>
        </Screen>
    );
};

export default Home;
