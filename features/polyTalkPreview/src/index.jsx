import React from "react";
import { createRoot } from "react-dom/client";
import { Slideshow } from "@polypoly-eu/poly-look";

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

    let title = "TEST Title";
    let sections = [
        {
            title: "Section 1",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            images: [],
        },
        {
            title: "Section 2",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            images: [],
        },
        {
            title: "Section 3",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            images: [],
        },
        {
            title: "Section 4",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            images: [],
        },
    ];

    return (
        <div>
            <h1>{title}</h1>
            <div>
                {sections.map((s, i) => (
                    <Section key={i} model={s} />
                ))}
            </div>
            <div>
                <h2>FOOTER</h2>
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById("feature"));
root.render(<App />);
