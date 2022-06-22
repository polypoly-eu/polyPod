import React from "react";
import { createRoot } from "react-dom/client";
import { Slideshow, Screen, ClickableCard } from "@polypoly-eu/poly-look";

import "./styles.css";

const App = () => {
    const Section = (props) => {
        return (
            <div>
                <h3>{props.model.title}</h3>
                <p>{props.model.description}</p>
                {props.model.images.length > 0 && (
                    <Slideshow images={props.model.images} />
                )}
            </div>
        );
    };

    const Footer = (props) => {
        return (
            <ClickableCard
                buttonText={props.model.buttonTitle}
                onlyButtonClickEvent={true}
                onClick={() => {}}
            >
                <h3>{props.model.title}</h3>
                <p>{props.model.description}</p>
                {image !== undefined && image !== "" && (
                    <img src={props.model.image} />
                )}
            </ClickableCard>
        );
    };

    let data = {
        title: "TEST Title",
        sections: [
            {
                title: "Section 1",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                images: ["./images/test.jpeg", "./images/test.jpeg"],
            },
            {
                title: "Section 2",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                images: ["./images/test.jpeg"],
            },
            {
                title: "Section 3",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                images: ["./images/test.jpeg"],
            },
            {
                title: "Section 4",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                images: [],
            },
        ],
        footer: {
            title: "Footer title",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            image: "./images/test.jpeg",
            buttonTitle: "Learn More",
            buttonLink: "https://polypoly.org/en-gb/",
        },
    };

    return (
        <Screen className="poly-theme-light" layout="poly-standard-layout">
            <div>
                <h1>{data.title}</h1>
                <div>
                    {data.sections.map((s, i) => (
                        <Section key={i} model={s} />
                    ))}
                </div>
                <div>
                    <Footer model={data.footer} />
                </div>
            </div>
        </Screen>
    );
};

const root = createRoot(document.getElementById("feature"));
root.render(<App />);
