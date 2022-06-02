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

const Home = () => {
    const { threads } = useContext(MessagesContext);

    const [activeThread, setActiveThreads] = useState(null);

    return (
        <Screen>
            {activeThread ? (
                <ConversationList>
                    <Conversation
                        name="Lilly"
                        lastSenderName="Lilly"
                        info="Yes i can do it for you"
                    >
                        <Avatar
                            src={lillyIco}
                            name="Lilly"
                            status="available"
                        />
                    </Conversation>
                    <Conversation
                        name="Joe"
                        lastSenderName="Joe"
                        info="Yes i can do it for you"
                    >
                        <Avatar src={joeIco} name="Joe" status="dnd" />
                    </Conversation>
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
