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

    function groupMessages() {
        const messages = activeRoom.messages;
        const messageGroups = [];
        for (let i = 0; i < messages.length; i++) {
            const currentMessage = messages[i];
            const currentSender = currentMessage.sender;
            const messagesToGroup = [];
            while (currentSender == messages[i]?.sender) {
                messagesToGroup.push(messages[i]);
                i++;
            }
            i--;
            messageGroups.push(
                <MessageGroup
                    key={i}
                    direction={currentMessage.direction}
                    sender={currentSender}
                    sentTime="just now"
                >
                    <MessageGroup.Messages>
                        {messagesToGroup.map((message, index) => (
                            <Message
                                key={index}
                                model={{
                                    message: message.message,
                                }}
                            ></Message>
                        ))}
                    </MessageGroup.Messages>
                    <MessageGroup.Footer>{currentSender}</MessageGroup.Footer>
                </MessageGroup>
            );
        }
        console.log(messageGroups);
        return messageGroups;
    }

    return (
        <Screen className="poly-theme-light room">
            <ConversationHeader>
                <p>{activeRoom.name}</p>
                <ConversationHeader.Content
                    userName={activeRoom.name}
                    info="Active 10 mins ago"
                />
            </ConversationHeader>
            <MainContainer>
                <ChatContainer>
                    <MessageList>
                        {groupMessages().map((message) => message)}
                    </MessageList>
                    <MessageInput placeholder="Type message here" />
                </ChatContainer>
            </MainContainer>
        </Screen>
    );
};

export default Room;
