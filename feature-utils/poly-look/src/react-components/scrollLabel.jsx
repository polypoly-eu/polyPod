import React, { useState } from "react";

import "./scrollLabel.css";

const ScrollLabel = ({ scrollRef, scrollLabelText, colors, img }) => {
  const [scrollingPosition, setScrollingPosition] = useState(0);

  const setUpScrollingListener = () => {
    if (scrollRef.current)
      scrollRef.current.addEventListener("scroll", (e) =>
        setScrollingPosition(e.target.scrollTop)
      );
  };

  return scrollingPosition < 100 ? (
    <div className={`scroll-button ${colors}`} onLoad={setUpScrollingListener}>
      <img src={img} /> <p>{scrollLabelText}</p>
    </div>
  ) : (
    <div style={{ display: "none" }} className="scroll-button"></div>
  );
};

export default ScrollLabel;
