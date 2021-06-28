import { navigation } from "../helpers";

const INDEX_ROUTE = "dist/index.html";

describe("Data types", () => {
    beforeEach(() => {
        cy.visit(INDEX_ROUTE);
        cy.get(".button-container button")
            .click()
            .then(() => {
                return cy
                    .get(
                        ".swiper-slide.swiper-slide-active .data-sharing-section.dataTypes-shared .data-sharing-gauge"
                    )
                    .click();
            });
    });

    it(`should change slide each time we click on the screen`, () => {
        navigation(
            0,
            (slide) => !slide.children(".slide-tap-target").length,
            () => {
                return cy.get(".swiper-slide-active .slide-tap-target").click();
            }
        );
    });

    it(`should change slide each time we click on the down-button`, () => {
        navigation(
            0,
            (slide) => !slide.children(".slide-tap-target").length,
            () => {
                return cy.get(".down-button").click();
            }
        );
    });

    it(`should change slide each time we swipe up on the screen`, () => {
        navigation(
            0,
            (slide) => !slide.children(".slide-tap-target").length,
            () => {
                return cy
                    .get(".swiper-slide-active")
                    .trigger("pointerdown", "bottom", { which: 1 })
                    .trigger("pointermove", "center")
                    .trigger("pointerup", { force: true });
            }
        );
    });

    it(`should be able to read the information "How to read this" from the slides 0, 2, 4, 5, 6, 7, 8 and 10`, () => {
        navigation(
            0,
            (slide) => !slide.children(".slide-tap-target").length,
            () =>
                cy.get(".static-content").then(($staticContent) => {
                    if (
                        $staticContent.children(".data-sharing-legend").length
                    ) {
                        cy.get(".swiper-slide-active").invoke(
                            "css",
                            "display",
                            "none"
                        );
                        return cy
                            .get(".static-content > .data-sharing-legend")
                            .click()
                            .then(() => {
                                return cy.get("button").click();
                            })
                            .then(() => cy.get(".down-button").click());
                    } else {
                        return cy.get(".down-button").click();
                    }
                })
        );
    });
});
