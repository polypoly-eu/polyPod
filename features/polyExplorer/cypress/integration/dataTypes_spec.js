import { navigation } from "../helpers";

describe("Data types", () => {
    beforeEach(() => {
        cy.visit("/");
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

    it(`should change of slide each time we click on the screen`, () => {
        navigation(
            0,
            (slide) => !slide.children(".slide-tap-target").length,
            (index) => {
                cy.matchImageSnapshot(`datatype${index}`);
                return cy.get(".swiper-slide-active .slide-tap-target").click();
            }
        );
    });

    it(`should change of slide each time we click on the down-button`, () => {
        navigation(
            0,
            (slide) => !slide.children(".slide-tap-target").length,
            (index) => {
                cy.matchImageSnapshot(`datatype${index}`);
                return cy.get(".down-button").click();
            }
        );
    });

    it(`should change of slide each time we shipe up on the screen`, () => {
        navigation(
            0,
            (slide) => !slide.children(".slide-tap-target").length,
            (index) => {
                cy.matchImageSnapshot(`datatype${index}`);
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
            (index) =>
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
                                cy.matchImageSnapshot(`datatypeinfo${index}`);
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
