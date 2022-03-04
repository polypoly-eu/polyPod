import SwiperCore from "swiper/core";
import i18n from "./i18n.js";

import "swiper/css";
import "./styles.css";

function getStaticContent(progress) {
    const circle = document.getElementsByClassName("circle")[0];

    let circleText = document.getElementsByClassName("above-circle-text")[0];
    if (!circleText) {
        circleText = document.createElement("p");
        circleText.className = "above-circle-text";
        circleText.innerHTML = i18n.t("common:explore.today");
        document.body.appendChild(circleText);
        circleText.style.display = "none";
    }

    let line = document.getElementsByClassName("line")[0];
    if (!line) {
        line = document.createElement("div");
        line.className = "line";
        document.body.appendChild(line);
        line.style.display = "none";
    }

    const circleDiameter = (diameter, text) => {
        circle.style.height = diameter + "px";
        circle.style.width = diameter + "px";
        circle.style.transform = `translate(-${diameter / 2}px, -${
            diameter / 2
        }px)`;
        circle.innerHTML = `<div class="page-number">${text}</div>`;
    };

    const steps = {
        0: 0,
        1: 50,
        2: 96,
        3: 282,
        4: 650,
        5: 988,
        6: 10000,
    };

    const getPercentage = (k) => {
        return (progress - (k - 1) / 6) / (1 / 6);
    };

    if (progress >= 0 && progress < 1 / 6) {
        circleDiameter(getPercentage(1) * steps[1], "");
        line.style.display = "none";
    }
    if (progress >= 1 / 6 && progress < 2 / 6) {
        circleDiameter(steps[1] + getPercentage(2) * (steps[2] - steps[1]), 1);
        line.style.display = "block";
        line.style.left = (1 - getPercentage(2)) * 30 + "%";
    }
    if (progress >= 2 / 6 && progress < 3 / 6) {
        circleDiameter(steps[2] + getPercentage(3) * (steps[3] - steps[2]), 2);
        line.style.left = "0%";
    }
    if (progress >= 3 / 6 && progress < 4 / 6) {
        circleDiameter(steps[3] + getPercentage(4) * (steps[4] - steps[3]), 3);
    }
    if (progress >= 4 / 6 && progress < 5 / 6) {
        circleDiameter(steps[4] + getPercentage(5) * (steps[5] - steps[4]), 4);
    }
    if (progress >= 5 / 6)
        circleDiameter(steps[5] + getPercentage(6) * (steps[6] - steps[5]), 5);
    if (progress == 1 / 6 && circleText) {
        circleText.style.display = "block";
    }
    if (progress != 1 / 6 && circleText) {
        circleText.style.display = "none";
    }

    const pageNumberText = document.querySelector(".page-number");
    if (pageNumberText)
        pageNumberText.style.display = progress >= 5.3 / 6 ? "none" : "block";
}

function initSwiper() {
    new SwiperCore(".swiper-container", {
        on: {
            click: function (swiper) {
                if (swiper.activeIndex == 0 || swiper.activeIndex == 5)
                    this.slideNext(500);
            },
            progress: function (swiper, progress) {
                getStaticContent(progress);
            },
        },
    });
}

function initLearnMoreButton() {
    // In loop mode, Swiper creates a duplicate of the slide with the 'learn
    // more' button, so we need to add the click handler to all.
    for (let button of document.getElementsByClassName("learn-more")) {
        button.addEventListener("click", function () {
            window.pod.polyNav.openUrl(this.dataset.target);
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
