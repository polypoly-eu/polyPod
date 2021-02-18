import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper";
import "swiper/swiper-bundle.min.css";

// install Swiper modules
SwiperCore.use(Pagination);

import FeaturedCompany from "../featuredCompany/featuredCompany.jsx";
import "./featuredCompanyHolder.css";

const FeaturedCompanyHolder = ({ featuredCompanies, onShowScreenChange }) => {
    return (
        <div className="featured-company-holder">
            <Swiper
                spaceBetween={1}
                slidesPerView={1}
                pagination
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => console.log(swiper)}
            >
                {featuredCompanies.map((company, index) => (
                    <SwiperSlide key={index}>
                        <FeaturedCompany
                            key={index}
                            company={company}
                            onShowScreenChange={onShowScreenChange}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default FeaturedCompanyHolder;
