import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "./tabs.css";

const Tab = () => {};

const Tabs = ({ children: tabList, swipe = true, onTabChange }) => {
  const [activeTabId, setActiveTabId] = useState(tabList[0].props.id);

  const swiperRef = useRef();

  const onTabClick = (ev, newActiveTabId, index) => {
    ev.preventDefault();
    swiperRef.current.swiper.slideTo(index);
    setActiveTabId(newActiveTabId);
    if (onTabChange) onTabChange(newActiveTabId);
  };

  return (
    <div className="tabs">
      <div className="tab-buttons">
        {tabList.map((tab, index) => (
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
          setActiveTabId(tabList[swiper.activeIndex].props.id);
          if (onTabChange) onTabChange(tabList[swiper.activeIndex].props.id);
        }}
      >
        {swipe
          ? tabList.map((tab) => (
              <SwiperSlide key={tab.props.id}>{tab.props.children}</SwiperSlide>
            ))
          : tabList.find((tab) => tab.props.id == activeTabId).props.children}
      </Swiper>
    </div>
  );
};

export { Tabs, Tab };
