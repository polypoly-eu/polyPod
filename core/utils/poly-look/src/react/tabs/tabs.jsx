import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Tab from "./tab.jsx";

import "./tabs.css";

const Tabs = ({ children, swipe = true }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const onTabClick = (ev, newActiveTabId) => {
    ev.preventDefault();
    setActiveTab(newActiveTabId);
  };

  return (
    <div className="tabs">
      <div className="tab-buttons">
        {children.map((tab, index) => (
          <button
            key={index}
            onClick={(ev) => onTabClick(ev, tab.props.label)}
            className={
              tab.props.label === activeTab ? "tab-button active" : "tab-button"
            }
          >
            {tab.props.translation || tab.props.label}
          </button>
        ))}
      </div>
      <Swiper
        spaceBetween={1}
        slidesPerView={1}
        initialSlide={0}
        watchOverflow={true}
        onSlideChange={(swiper) =>
          setActiveTab(children[swiper.activeIndex].props.label)
        }
      >
        {swipe
          ? children.map((tab, index) => (
              <SwiperSlide key={index}>{tab.props.children}</SwiperSlide>
            ))
          : children.find((tab) => tab.props.label == activeTab).props.children}
      </Swiper>
    </div>
  );
};

export { Tabs, Tab };
