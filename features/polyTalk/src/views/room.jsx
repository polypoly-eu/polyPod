import React, { useContext } from "react";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    ConversationHeader,
    Avatar,
} from "@chatscope/chat-ui-kit-react";
import { Screen } from "@polypoly-eu/poly-look";
import { MessagesContext } from "../context/messages.jsx";

const Room = () => {
    const { activeRoom } = useContext(MessagesContext);
    return (
        <Screen className="poly-theme-light">
            <ConversationHeader>
                <Avatar name={activeRoom.participants[0]} />
                <ConversationHeader.Content
                    userName={activeRoom.participants[0]}
                    info="Active 10 mins ago"
                />
            </ConversationHeader>
            <MainContainer>
                <ChatContainer>
                    <MessageList>
                        {activeRoom.messages.map((message, i) => (
                            <Message
                                key={i}
                                model={{
                                    message: message.message,
                                    sentTime: message.timeElapsed + "werid ms",
                                    sender: message.sender,
                                }}
                            />
                        ))}
                    </MessageList>
                    <MessageInput placeholder="Type message here" />
                </ChatContainer>
            </MainContainer>
        </Screen>
    );
};

export default Room;
