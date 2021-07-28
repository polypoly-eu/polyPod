import React, { useState, useEffect, useRef } from "react";
import i18n from "../../../i18n";
import { INTRO_ANIMATIONS } from "../../../constants";

import "./introduction.css";

const i18nHeader = "clusterMessengerStory";
const listOfMessengerApps = [
    "FB Messenger",
    "iMessage",
    "Instagram",
    "Signal",
    "Snapchat",
    "Telegram",
    "Threema",
    "TikTok",
    "WhatsApp",
];

const phoneCorrectionX = 20;
const pohneCorrectionY = 50;
const circleRotateDeg = 40;
const circleScale = 2.5;

const Introduction = ({ animation, setHeight }) => {
    const [circleStyles, updateCircleStyles] = useState({});
    const guyImage = useRef();
    const messengerList = useRef();
    const circleImage = useRef();
    const wholeIntroduction = useRef();

    function _getBulletsMessengerApps() {
        return listOfMessengerApps.map((messenger, index) => (
            <li key={index} className="messenger-el">
                {messenger}
            </li>
        ));
    }

    function _deScaleAnimation() {
        const circleStyles = {
            transition: "transform 1s ease-in",
            transform: "scale(1)",
        };

        updateCircleStyles(circleStyles);
    }

    function _animationBackward() {
        const circleStyles = {
            transition: "transform 1s ease-in",
            transform: `translate( ${phoneCorrectionX}px, ${pohneCorrectionY}px) rotate(-${circleRotateDeg}deg)`,
        };

        updateCircleStyles(circleStyles);
    }

    function _fullAnimationBackward() {
        _deScaleAnimation();
        setTimeout(() => {
            _animationBackward();
        }, 0);
    }

    function _animationForward() {
        const listPosition = messengerList.current.getBoundingClientRect();
        const circlePosition = circleImage.current.getBoundingClientRect();
        const listCenterX = Math.ceil(
            listPosition.left + listPosition.width / 2
        );
        const listCenterY = Math.ceil(
            listPosition.top + listPosition.height / 2
        );
        const circleCenterX = Math.ceil(
            circlePosition.left + circlePosition.width / 2
        );
        const circleCenterY = Math.ceil(
            circlePosition.top + circlePosition.height / 2
        );

        const moveOnX = listCenterX - circleCenterX;
        const moveOnY = listCenterY - circleCenterY;

        updateCircleStyles({
            ...circleStyles,
            transition: "transform 1s ease-in",
            transform: `translate(${moveOnX}px, ${moveOnY}px) rotate(-90deg) scale(${circleScale})`,
        });
    }

    useEffect(() => {
        const { height } = wholeIntroduction.current.getBoundingClientRect();
        setHeight(height);
        switch (animation) {
            case INTRO_ANIMATIONS.FORDWARD:
                _animationForward();
                break;
            case INTRO_ANIMATIONS.BACKWARD:
                _fullAnimationBackward();
                break;
        }
    }, [animation]);

    return (
        <div className="messenger-intro" ref={wholeIntroduction}>
            <h1 className="story-title">{i18n.t(`${i18nHeader}:title`)}</h1>
            <p className="story-paragraph one">
                {i18n.t(`${i18nHeader}:intro.paragraph.one`)}
            </p>
            <div
                className="story-circle"
                style={circleStyles}
                ref={circleImage}
            ></div>
            <img
                ref={guyImage}
                className="story-intro-img"
                src="images/stories/messenger/intro-guy.svg"
                alt={i18n.t(`${i18nHeader}:intro.image.alt`)}
            />
            <p className="story-paragraph two upper">
                {i18n.t(`${i18nHeader}:intro.paragraph.two`)}
            </p>
            <ul
                className="story-paragraph messenger-list upper"
                ref={messengerList}
            >
                {_getBulletsMessengerApps()}
            </ul>
        </div>
    );
};

export default Introduction;
