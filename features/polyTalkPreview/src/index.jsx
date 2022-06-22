import React from "react";
import { createRoot } from "react-dom/client";
import { Slideshow, Screen, ClickableCard } from "@polypoly-eu/poly-look";
import content from "./static/content.json";

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
                {props.model.image !== undefined &&
                    props.model.image !== "" && <img src={props.model.image} />}
            </ClickableCard>
        );
    };

    return (
        <Screen className="poly-theme-light" layout="poly-standard-layout">
            <div>
                <h1>{content.title}</h1>
                <div>
                    {content.sections.map((s, i) => (
                        <Section key={i} model={s} />
                    ))}
                </div>
                <div>
                    <Footer model={content.footer} />
                </div>
            </div>
        </Screen>
    );
};

const root = createRoot(document.getElementById("feature"));
root.render(<App />);
