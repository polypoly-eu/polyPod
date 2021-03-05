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
    onShowScreenChange,
    initialSlide,
    onUpdateInitialSlide,
    setShowConstructionPopUp,
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
            Math.round(value.reduce((a, b) => a + b, 0) / value.length),
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
                            onShowScreenChange={onShowScreenChange}
                            setShowConstructionPopUp={setShowConstructionPopUp}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default FeaturedCompanyHolder;
