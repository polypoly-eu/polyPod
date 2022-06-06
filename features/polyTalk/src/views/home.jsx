import React, { useContext } from "react";
import { Screen } from "@polypoly-eu/poly-look";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    ConversationList,
    Conversation,
    Avatar,
} from "@chatscope/chat-ui-kit-react";
import { MessagesContext } from "../context/messages.jsx";

const Home = () => {
    const { rooms, handleSelectRoom } = useContext(MessagesContext);

    return (
        <Screen className="poly-theme-light">
            <ConversationList>
                {Object.entries(rooms).map(([name, room], i) => (
                    <Conversation
                        key={i}
                        name={name}
                        lastSenderName={room.lastMessage.sender}
                        info={room.lastMessage.message}
                        onClick={() => handleSelectRoom(room)}
                    >
                        <Avatar src={"images/thorsten.png"} name="Thorsten" />
                    </Conversation>
                ))}
            </ConversationList>
        </Screen>
    );
};

export default Home;
