import React, { useState } from "react";
import i18n from "../../../i18n.js";

import "./scrollButton.css";

const ScrollButton = ({ scrollRef }) => {
    const [scrollingPosition, setScrollingPosition] = useState(0);

    const setUpScrollingListener = () => {
        if (scrollRef.current)
            scrollRef.current.addEventListener("scroll", (e) =>
                setScrollingPosition(e.target.scrollTop)
            );
    };

    return scrollingPosition < 100 ? (
        <div className="scroll-button" onLoad={setUpScrollingListener}>
            <img src="./images/scroll-down.svg" />{" "}
            <p>{i18n.t("import:scroll.down")}</p>
        </div>
    ) : (
        <div style={{ display: "none" }} className="scroll-button"></div>
    );
};

export default ScrollButton;
