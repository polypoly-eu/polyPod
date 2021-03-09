import SwiperCore, { Pagination } from "swiper/core";
import i18n from "./i18n.js";

import "swiper/swiper-bundle.css";
import "./styles.css";

const slideData = [
    {
        headline: { innerHTML: i18n.t("common:slide1.headline") },
        subHeadline: { innerHTML: i18n.t("common:slide1.subHeadline") },
        bodyText: { innerHTML: i18n.t("common:slide1.bodyText") },
    },
    {
        headline: { innerHTML: i18n.t("common:slide7.headline") },
        subHeadline: { innerHTML: i18n.t("common:slide7.subHeadline") },
        bodyText: { innerHTML: i18n.t("common:slide7.bodyText") },
        learnMoreButton: { hidden: false },
    },
];

function instantiateSlideContent(data, outerSlide) {
    const contentTemplate = document.getElementById(
        outerSlide
            ? "outer-slide-content-template"
            : "inner-slide-content-template"
    );
    const content = contentTemplate.content.cloneNode(true);
    const elements = content.querySelectorAll("[data-key]");
    for (let element of elements) {
        const elementData = data[element.dataset.key] || {};
        console.log(elementData);
        for (let [property, value] of Object.entries(elementData))
            element[property] = value;
    }
    return content.childNodes;
}

function instantiateSlides() {
    const slideTemplate = document.getElementById("slide-template");
    const swiperWrapper = document.querySelector(".swiper-wrapper");
    for (let [i, slideDataItem] of slideData.entries()) {
        const contentNodes = instantiateSlideContent(
            slideDataItem,
            i === 0 || i === slideData.length - 1
        );
        const slide = slideTemplate.content.cloneNode(true);
        slide
            .querySelector("[data-key='slideContentWrapper']")
            .append(...contentNodes);
        swiperWrapper.append(...slide.childNodes);
    }
}

function initSwiper() {
    SwiperCore.use([Pagination]);
    new SwiperCore(".swiper-container", {
        pagination: {
            el: ".swiper-pagination",
        },
    });
}

function initUi() {
    instantiateSlides();
    initSwiper();
}

function insertStrings() {
    const elements = document.querySelectorAll("[data-i18n-key]");
    for (let element of elements) {
        const key = element.dataset.i18nKey;
        element.textContent = i18n.t(key);
    }
}

initUi();
insertStrings();
