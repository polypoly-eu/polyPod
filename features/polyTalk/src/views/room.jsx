import React, { useContext } from "react";
import {
    MainContainer,
    ChatContainer,
    MessageGroup,
    Message,
    MessageList,
    MessageInput,
    ConversationHeader,
    Avatar,
} from "@chatscope/chat-ui-kit-react";
import { Screen } from "@polypoly-eu/poly-look";
import { MessagesContext } from "../context/messages.jsx";

import "./room.css";

const Room = () => {
    const { activeRoom } = useContext(MessagesContext);
    return (
        <Screen className="poly-theme-light room">
            <ConversationHeader>
                {activeRoom.name}
                <ConversationHeader.Content
                    userName={activeRoom.name}
                    info="Active 10 mins ago"
                />
            </ConversationHeader>
            <MainContainer>
                <ChatContainer>
                    <MessageList>
                        {activeRoom.messages.map((message, i) => (
                            <MessageGroup
                                key={i}
                                direction={message.direction}
                                sender={message.sender}
                                sentTime="just now"
                            >
                                <MessageGroup.Messages>
                                    <Message
                                        key={i}
                                        model={{
                                            message: message.message,
                                        }}
                                    ></Message>
                                </MessageGroup.Messages>
                            </MessageGroup>
                        ))}
                    </MessageList>
                    <MessageInput placeholder="Type message here" />
                </ChatContainer>
            </MainContainer>
        </Screen>
    );
};

export default Room;
