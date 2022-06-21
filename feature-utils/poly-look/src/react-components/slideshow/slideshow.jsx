import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper";

import "./slideshow.css";

const Slideshow = ({ images }) => {
  SwiperCore.use([Pagination]);
  return (
    <div className="poly-slideshow">
      <Swiper pagination={true} spaceBetween={0} slidesPerView={1}>
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slideshow;
