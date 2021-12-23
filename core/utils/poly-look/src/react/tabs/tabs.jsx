import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Tab from "./tab.jsx";

import "./tabs.css";

// TODO: swipe should default to true, but clicking on tabs currently does not
//       change tab content if this is set.
const Tabs = ({ children, swipe = false }) => {
  const [activeTabId, setActiveTabId] = useState(children[0].props.id);

  const onTabClick = (ev, newActiveTabId) => {
    ev.preventDefault();
    setActiveTabId(newActiveTabId);
  };

  return (
    <div className="tabs">
      <div className="tab-buttons">
        {children.map((tab, index) => (
          <button
            key={index}
            onClick={(ev) => onTabClick(ev, tab.props.id)}
            className={
              tab.props.id === activeTabId ? "tab-button active" : "tab-button"
            }
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <Swiper
        spaceBetween={1}
        slidesPerView={1}
        initialSlide={0}
        watchOverflow={true}
        onSlideChange={(swiper) =>
          setActiveTabId(children[swiper.activeIndex].props.id)
        }
      >
        {swipe
          ? children.map((tab) => (
              <SwiperSlide key={tab.props.id}>{tab.props.children}</SwiperSlide>
            ))
          : children.find((tab) => tab.props.id == activeTabId).props.children}
      </Swiper>
    </div>
  );
};

export { Tabs, Tab };
