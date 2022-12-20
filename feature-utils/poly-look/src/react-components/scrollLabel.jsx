import React, { useState } from "react";

import "./scrollLabel.css";

/**
 * A label nudging the user to scroll down.
 *
 * @function
 * @param props
 * @param props.scrollRef - The scrollable element.
 * @param props.scrollLabelText - The text of the label.
 * @param props.img - The image rendered on the label.
 */
const ScrollLabel = ({ scrollRef, scrollLabelText, img }) => {
  const [scrollingPosition, setScrollingPosition] = useState(0);

  const setUpScrollingListener = () => {
    if (scrollRef.current)
      scrollRef.current.addEventListener("scroll", (e) =>
        setScrollingPosition(e.target.scrollTop)
      );
  };

  return scrollingPosition < 100 ? (
    <div className={"scroll-button"} onLoad={setUpScrollingListener}>
      <img src={img} /> <p>{scrollLabelText}</p>
    </div>
  ) : (
    <div style={{ display: "none" }} className="scroll-button"></div>
  );
};

export default ScrollLabel;
