import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
    Slideshow,
    Screen,
    ClickableCard,
    ProgressBanner,
} from "@polypoly-eu/poly-look";
import content from "./static/content.json";
import i18n from "!silly-i18n";

import "./styles.css";

const Section = (props) => {
    return (
        <div className="section">
            <h3 className="section-title">{i18n.t(props.model.title)}</h3>
            <p>{i18n.t(props.model.description)}</p>
            {props.model.images.length > 0 && (
                <Slideshow images={props.model.images} />
            )}
        </div>
    );
};

const Footer = (props) => {
    return (
        <div className="footer">
            <ClickableCard
                buttonText={i18n.t(props.model.buttonTitle)}
                onlyButtonClickEvent={true}
                onClick={() => {
                    props.pod.polyNav.openUrl(props.model.buttonLink);
                }}
            >
                <h3>{i18n.t(props.model.title)}</h3>
                <p>{i18n.t(props.model.description)}</p>
                {props.model.image !== undefined &&
                    props.model.image !== "" && <img src={props.model.image} />}
            </ClickableCard>
        </div>
    );
};

const App = () => {
    const [pod, setPod] = useState(null);

    const initPod = async () => await window.pod;

    //on startup
    useEffect(() => {
        initPod().then((newPod) => {
            setPod(newPod);
        });
    }, []);

    return (
        <Screen className="poly-theme-light" layout="poly-standard-layout">
            <div className="preview">
                <ProgressBanner
                    stage={content.progress_banner.stage}
                    title={i18n.t(content.progress_banner.title)}
                    description={i18n.t(content.progress_banner.description)}
                />
                <h1>{i18n.t(content.title)}</h1>
                <div>
                    {content.sections.map((s, i) => (
                        <Section key={i} model={s} />
                    ))}
                </div>
                <div>
                    <Footer model={content.footer} pod={pod} />
                </div>
            </div>
        </Screen>
    );
};

const root = createRoot(document.getElementById("feature"));
root.render(<App />);
