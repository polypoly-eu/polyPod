import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper";
import "swiper/swiper-bundle.min.css";

// install Swiper modules
SwiperCore.use(Pagination);

import FeaturedCompany from "../featuredCompany/featuredCompany.jsx";
import "./featuredCompanyHolder.css";

function calculateAverage(values) {
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.round(10 * average) / 10;
}

const FeaturedCompanyHolder = ({
    featuredCompanies,
    onActiveScreenChange,
    initialSlide,
    onUpdateInitialSlide,
}) => {
    const counts = {
        dataTypes: featuredCompanies.map(
            (company) => company.dataTypesShared.length
        ),
        purposes: featuredCompanies.map(
            (company) => company.dataSharingPurposes.length
        ),
        companies: featuredCompanies.map(
            (company) => company.dataRecipients.length
        ),
        jurisdictions: featuredCompanies.map((company) =>
            company.jurisdictionsShared
                ? company.jurisdictionsShared.children.length
                : 0
        ),
    };
    const maxValues = Object.fromEntries(
        Object.entries(counts).map(([key, value]) => [key, Math.max(...value)])
    );
    const averageValues = Object.fromEntries(
        Object.entries(counts).map(([key, value]) => [
            key,
            calculateAverage(value),
        ])
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
                {featuredCompanies.map((company, index) => (
                    <SwiperSlide key={index}>
                        <FeaturedCompany
                            key={index}
                            company={company}
                            maxValues={maxValues}
                            averageValues={averageValues}
                            onActiveScreenChange={onActiveScreenChange}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default FeaturedCompanyHolder;
