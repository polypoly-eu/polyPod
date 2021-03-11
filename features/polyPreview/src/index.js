import SwiperCore, { Pagination } from "swiper/core";
import i18n from "./i18n.js";

import "swiper/swiper-bundle.css";
import "./styles.css";

if (!window.podNav) {
    window.podNav = {
        openUrl: (url) => window.open(url, "_blank"),
    };
}

function initSwiper() {
    SwiperCore.use([Pagination]);
    new SwiperCore(".swiper-container", {
        pagination: {
            el: ".swiper-pagination",
        },
    });
}

function initLearnMoreButton() {
    const button = document.getElementById("learn-more");
    button.addEventListener("click", function() {
        podNav.openUrl(button.dataset.target);
    });
}

function insertStrings() {
    for (let element of document.querySelectorAll("[data-i18n-key]"))
        element.innerHTML = i18n.t(element.dataset.i18nKey);
}

function initUi() {
    initSwiper();
    initLearnMoreButton();
    insertStrings();
}

initUi();
