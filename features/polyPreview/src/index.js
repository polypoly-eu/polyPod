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

function insertStrings() {
    for (let element of document.querySelectorAll("[data-i18n-key]"))
        element.innerHTML = i18n.t(element.dataset.i18nKey);
}

initSwiper();
insertStrings();
