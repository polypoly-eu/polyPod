import React, { useContext, useState } from "react";
import { Screen } from "@polypoly-eu/poly-look";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    ConversationList,
    Conversation,
} from "@chatscope/chat-ui-kit-react";
import { MessagesContext } from "../context/messages.jsx";

const Home = () => {
    const { rooms } = useContext(MessagesContext);

    const [activeThreads, setActiveThreads] = useState(null);

    return (
        <Screen>
            {activeThreads ? (
                <MainContainer>
                    <ChatContainer>
                        <MessageList>
                            <Message
                                model={{
                                    message: "Hello my friend",
                                    sentTime: "just now",
                                    sender: "Joe",
                                }}
                            />
                        </MessageList>
                        <MessageInput placeholder="Type message here" />
                    </ChatContainer>
                </MainContainer>
            ) : (
                <ConversationList>
                    {rooms.map((room) => (
                        <Conversation
                            name={room.participants[0]}
                            lastSenderName={room.lastMessage.sender}
                            info={room.lastMessage.message}
                        ></Conversation>
                    ))}
                </ConversationList>
            )}
        </Screen>
    );
};

export default Home;
