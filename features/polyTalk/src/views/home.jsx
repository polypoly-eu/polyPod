import React from "react";
import { Screen } from "@polypoly-eu/poly-look";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { MessageThread } from "../model/messageThread";
import { Message } from "../model/message";

const Home = () => {
    const { threads } = useContext(MessagesContext);

    const [activeThreads, setActiveThreads] = useState(null);

    return (
        <Screen>
            {activeThreads ? (
                <ConversationList>
                    {activeThreads.map((thread) => (
                        <Consersation
                            name={thread.participants[0]}
                            lastSenderName={threads.lastMessage.sender}
                            info={threads.lastMessage.message}
                        ></Consersation>
                    ))}
                </ConversationList>
            ) : null}
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
        </Screen>
    );
};

export default Home;
