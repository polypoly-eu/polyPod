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
    const { activeRoom, handleSendMessage } = useContext(MessagesContext);

    const otherPersonsName = activeRoom.messages.filter(
        (message) => message.sender !== "self"
    )[0].sender;

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
        return messageGroups;
    }

    return (
        <Screen className="poly-theme-light room">
            <ConversationHeader>
                <Avatar src={"images/thorsten.png"} name="Thorsten" />
                <ConversationHeader.Content
                    userName={otherPersonsName}
                    info="Active 10 mins ago"
                />
            </ConversationHeader>
            <MainContainer>
                <ChatContainer>
                    <MessageList>
                        {groupMessages().map((message) => message)}
                    </MessageList>
                    <MessageInput
                        placeholder="Type message here"
                        attachButton={false}
                        onSend={handleSendMessage}
                    />
                </ChatContainer>
            </MainContainer>
        </Screen>
    );
};

export default Room;
