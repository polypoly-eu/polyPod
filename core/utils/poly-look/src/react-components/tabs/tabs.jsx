import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Tab from "./tab.jsx";

import "./tabs.css";

const Tabs = ({ children, swipe = true, onTabChange = () => {} }) => {
  const [activeTabId, setActiveTabId] = useState(children[0].props.id);

  const swiperRef = useRef();

  const onTabClick = (ev, newActiveTabId, index) => {
    ev.preventDefault();
    swiperRef.current.swiper.slideTo(index);
    setActiveTabId(newActiveTabId);
    onTabChange(newActiveTabId);
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
      <Swiper
        ref={swiperRef}
        spaceBetween={1}
        slidesPerView={1}
        initialSlide={0}
        watchOverflow={true}
        onSlideChange={(swiper) => {
          setActiveTabId(children[swiper.activeIndex].props.id);
          onTabChange(children[swiper.activeIndex].props.id);
        }}
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
