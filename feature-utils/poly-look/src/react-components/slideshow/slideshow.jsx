import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper";

import "./slideshow.css";

/**
 * It takes in an array of images and returns a slideshow.
 * @component
 * @param {Object} props
 * @param {Array.<String>} [props.images] - Array that contains the urls of the
 * images that will be displayed.
 * @returns {JSX.Element}
 */
const Slideshow = ({ images }) => {
  SwiperCore.use([Pagination]);
  return (
    <div className="poly-slideshow">
      <Swiper pagination={true} spaceBetween={100} slidesPerView={1}>
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
