import React, { useRef } from "react";
import i18n from "../../i18n";
import "./listOfDetails.css";
import ScrollButton from "../buttons/scrollButton/scrollButton.jsx";

const optimalGradientScrollingRatio = 0.84;

const ListOfDetails = ({ list }) => {
    const gradient1 = useRef();
    const gradient2 = useRef();
    const listRef = useRef();
    const handleScroll = (e) => {
        if (e.target.scrollTop === 0) {
            gradient1.current.classList.remove("gradient");
        } else {
            gradient1.current.classList.add("gradient");
        }

        if (
            e.target.scrollTop / e.target.scrollHeight >
            optimalGradientScrollingRatio
        ) {
            gradient2.current.classList.remove("gradient");
        } else {
            gradient2.current.classList.add("gradient");
        }
    };
    return (
        <div className="scrollable-list">
            <div className="list-gradient reverse" ref={gradient1}></div>
            <ul ref={listRef} onScroll={handleScroll}>
                {list.map((interest, index) => {
                    return (
                        <li key={index}>
                            <span className="items">{interest}</span>
                        </li>
                    );
                })}
            </ul>
            <div className="list-gradient gradient" ref={gradient2}></div>
            <ScrollButton
                scrollRef={listRef}
                className="scroll-button"
                scrollButtonText={i18n.t("explore:scroll")}
                img="./images/scroll-up-blue.svg"
                colors="light"
            />
        </div>
    );
};

export default ListOfDetails;
