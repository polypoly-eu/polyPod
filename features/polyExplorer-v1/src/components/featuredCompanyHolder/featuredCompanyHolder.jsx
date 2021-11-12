import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper";
import "swiper/swiper-bundle.min.css";

// install Swiper modules
SwiperCore.use(Pagination);

import FeaturedCompany from "../featuredCompany/featuredCompany.jsx";
import "./featuredCompanyHolder.css";

const FeaturedCompanyHolder = ({
    featuredCompanies,
    onOpenDetails,
    onOpenInfo,
    initialSlide,
    onUpdateInitialSlide,
    maxValues,
    averageValues,
    onOpenDataExplorationSection,
}) => {
    const sortedFeaturedCompanies = Object.values(featuredCompanies).sort(
        (a, b) => a.compareNames(b)
    );
    return (
        <div className="featured-company-holder">
            <Swiper
                spaceBetween={1}
                slidesPerView={1}
                pagination
                loop="true"
                initialSlide={initialSlide}
                onSlideChange={(swiper) =>
                    onUpdateInitialSlide(swiper.activeIndex - 1)
                }
            >
                {sortedFeaturedCompanies.map((company, index) => (
                    <SwiperSlide key={index}>
                        <FeaturedCompany
                            key={index}
                            company={company}
                            maxValues={maxValues}
                            averageValues={averageValues}
                            onOpenDetails={onOpenDetails}
                            onOpenInfo={onOpenInfo}
                            onOpenDataExplorationSection={
                                onOpenDataExplorationSection
                            }
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default FeaturedCompanyHolder;
