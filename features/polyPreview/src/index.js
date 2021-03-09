import SwiperCore, { Pagination } from "swiper/core";
import i18n from "./i18n.js";

import "swiper/swiper-bundle.css";
import "./styles.css";

function initSwiper() {
    SwiperCore.use([Pagination]);
    new SwiperCore(".swiper-container", {
        pagination: {
            el: ".swiper-pagination",
        },
    });
}

function initUi() {
    const swiperWrapper = document.querySelector(".swiper-wrapper");
    const template = document.getElementById("slide");
    const keys = ["common:hello", "common:todo"];
    for (let key of keys) {
        const slide = template.content.cloneNode(true);
        slide.querySelector("h1").dataset.i18nKey = key;
        swiperWrapper.appendChild(slide);
    }
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
