import React, { useState, useEffect, useRef } from "react";
import i18n from "../../../i18n";
import { StoryParagraph } from "./storyParagraph";
import { ClusterSections } from "../clusterSections";
import SectionTitle from "../sectionTitle.jsx";
import "./summary.css";

const i18nHeader = "clusterMessengerStory";

const Summary = ({ animation, heightEvent }) => {
    const wholeSummary = useRef();
    const [bulletsAnimation, fireBulletsAnimation] = useState([
        "hidden",
        "hidden",
        "hidden",
    ]);

    const bullets = [
        {
            strongText: "summary.paragraph.two.strong",
            lightText: "summary.paragraph.two",
        },
        {
            className: "bullet-summary",
            strongText: "summary.paragraph.three.strong",
            lightText: "summary.paragraph.three.strong",
        },
        {
            className: "bullet-summary",
            strongText: "summary.paragraph.four.strong",
            lightText: "summary.paragraph.four",
        },
    ];

    function _renderBullets() {
        return bullets.map((bullet, index) => {
            const copyBullet = { ...bullet };

            return (
                <li
                    className={`bullet-summary ${
                        index === 0
                            ? "bullet-one"
                            : index === 1
                            ? "bullet-two"
                            : "bullet-three"
                    } ${bulletsAnimation[index]}`}
                    key={index}
                >
                    <span
                        className={`strong-text ${
                            index === 0
                                ? "bullet-one"
                                : index === 1
                                ? "bullet-two"
                                : "bullet-three"
                        } ${bulletsAnimation[index]}`}
                    >
                        {i18n.t(`${i18nHeader}:${copyBullet.strongText}`)}
                    </span>
                    <span
                        className={`light-text ${
                            index === 0
                                ? "bullet-one"
                                : index === 1
                                ? "bullet-two"
                                : "bullet-three"
                        } ${bulletsAnimation[index]}`}
                    >
                        {i18n.t(`${i18nHeader}:${copyBullet.lightText}`)}
                    </span>
                </li>
            );
        });
    }

    function _showBullet(numBullets) {
        const copyBulletsAnimation = [...bulletsAnimation];
        const leng = copyBulletsAnimation.length;

        for (let i = 0; i < leng; i++) {
            if (i < numBullets) {
                copyBulletsAnimation[i] = "visible";
            } else {
                copyBulletsAnimation[i] = "hidden";
            }
        }

        fireBulletsAnimation(copyBulletsAnimation);
    }

    useEffect(() => {
        const { height } = wholeSummary.current.getBoundingClientRect();
        heightEvent(height);
        _showBullet(animation);
    }, [animation]);

    return (
        <ClusterSections
            as="div"
            className="messenger-summary"
            ref={wholeSummary}
        >
            <h1 className="title-summary">
                {i18n.t(`${i18nHeader}:summary.title`)}
            </h1>
            <SectionTitle
                title={i18n.t(`${i18nHeader}:summary.section`)}
            ></SectionTitle>
            <StoryParagraph as="div" className="introduction-summary">
                {i18n.t(`${i18nHeader}:summary.paragraph.one`)}
            </StoryParagraph>
            <ol className="things-to-be-aware">{_renderBullets()}</ol>
        </ClusterSections>
    );
};

export default Summary;
