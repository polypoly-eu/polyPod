import SwiperCore, { Pagination } from "swiper/core";
import i18n from "./i18n.js";

import "swiper/swiper-bundle.css";
import "./styles.css";

const podNav = window.podNav || {
    openUrl: (url) => window.open(url, "_blank"),
};

function initSwiper() {
    SwiperCore.use([Pagination]);
    new SwiperCore(".swiper-container", {
        pagination: {
            el: ".swiper-pagination",
        },
        loop: true,
    });
}

function initLearnMoreButton() {
    // In loop mode, Swiper creates a duplicate of the slide with the 'learn
    // more' button, so we need to add the click handler to all.
    for (let button of document.getElementsByClassName("learn-more")) {
        button.addEventListener("click", function () {
            podNav.openUrl(this.dataset.target);
        });
    }
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
