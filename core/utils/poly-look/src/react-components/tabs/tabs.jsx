import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useWindowDimensions } from "../../../../../../hooks/dimensions.js";
import Tab from "./tab.jsx";

import "./tabs.css";

const Tabs = ({ children, swipe = true, onTabChange, autoHeight = false }) => {
  const [activeTabId, setActiveTabId] = useState(children[0].props.id);
  const swiperRef = useRef();

  const TAB_HEIGHT = 40;
  const { height } = useWindowDimensions();
  const heightStyle = autoHeight
    ? { height: height - TAB_HEIGHT, overflow: "auto" }
    : {};

  const onTabClick = (ev, newActiveTabId, index) => {
    ev.preventDefault();
    swiperRef.current.swiper.slideTo(index);
    setActiveTabId(newActiveTabId);
    if (onTabChange) onTabChange(newActiveTabId);
  };

  return (
    <div className="tabs">
      <div className="tab-buttons">
        {children.map((tab, index) => (
          <button
            key={index}
            onClick={(ev) => onTabClick(ev, tab.props.id, index)}
            className={
              tab.props.id === activeTabId ? "tab-button active" : "tab-button"
            }
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div style={heightStyle}>
        <Swiper
          ref={swiperRef}
          spaceBetween={1}
          slidesPerView={1}
          initialSlide={0}
          autoHeight={autoHeight}
          watchOverflow={true}
          onSlideChange={(swiper) => {
            setActiveTabId(children[swiper.activeIndex].props.id);
            if (onTabChange) onTabChange(children[swiper.activeIndex].props.id);
          }}
        >
          {swipe
            ? children.map((tab) => (
                <SwiperSlide key={tab.props.id}>
                  {tab.props.children}
                </SwiperSlide>
              ))
            : children.find((tab) => tab.props.id == activeTabId).props
                .children}
        </Swiper>
      </div>
    </div>
  );
};

export { Tabs, Tab };
