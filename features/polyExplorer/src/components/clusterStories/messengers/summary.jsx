import React, { useState, useEffect } from "react";
import i18n from "../../../i18n";
import { StoryParagraph } from "./storyParagraph";
import { SUMARY_ANIMATIONS } from "../../../constants";
import "./summary.css";

const i18nHeader = "clusterMessengerStory";

const Summary = ({ animation }) => {
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

    function renderBullets() {
        return bullets.map((bullet, index) => {
            const copyBullet = { ...bullet };

            return (
                <li
                    className={`bullet-summary ${bulletsAnimation[index]}`}
                    key={index}
                >
                    <span className={`strong-text ${bulletsAnimation[index]}`}>
                        {i18n.t(`${i18nHeader}:${copyBullet.strongText}`)}
                    </span>
                    <span className={`light-text ${bulletsAnimation[index]}`}>
                        {i18n.t(`${i18nHeader}:${copyBullet.lightText}`)}
                    </span>
                </li>
            );
        });
    }

    function showBullet(index) {
        const copyBulletsAnimation = [...bulletsAnimation];
        copyBulletsAnimation[index] = "visible";

        fireBulletsAnimation(copyBulletsAnimation);
    }

    function hideBullet(index) {
        const copyBulletsAnimation = [...bulletsAnimation];
        copyBulletsAnimation[index] = "hidden";
        fireBulletsAnimation(copyBulletsAnimation);
    }

    useEffect(() => {
        switch (animation) {
            case SUMARY_ANIMATIONS.HIDE_ONE:
                hideBullet(0);
                break;
            case SUMARY_ANIMATIONS.HIDE_TWO:
                hideBullet(1);
                break;
            case SUMARY_ANIMATIONS.HIDE_THREE:
                hideBullet(2);
                break;
            case SUMARY_ANIMATIONS.SHOW_ONE:
                showBullet(0);
                break;
            case SUMARY_ANIMATIONS.SHOW_TWO:
                showBullet(1);
                break;
            case SUMARY_ANIMATIONS.SHOW_THREE:
                showBullet(2);
                break;
        }
    }, [animation]);

    return (
        <div className="messenger-summary">
            <h1 className="title-summary">
                {i18n.t(`${i18nHeader}:summary.title`)}
            </h1>
            <div className="section-summary">
                <div className="line"></div>
                <h3 className="section-title">
                    {i18n.t(`${i18nHeader}:summary.section`)}
                </h3>
                <div className="line"></div>
            </div>
            <StoryParagraph as="div" className="introduction-summary">
                {i18n.t(`${i18nHeader}:summary.paragraph.one`)}
            </StoryParagraph>
            <ol className="things-to-be-aware">{renderBullets()}</ol>
        </div>
    );
};

export default Summary;
