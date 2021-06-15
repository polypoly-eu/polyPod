describe("Data types", () => {
    const slides = 11;
    const slidesWithInfo = [0, 2, 4, 5, 6, 7, 8, 10];

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
        for (let i = 0; i < slides; i++) {
            cy.matchImageSnapshot(`datatype${i}`);
            cy.get(".swiper-slide-active .slide-tap-target").click();
        }
    });

    it(`should change of slide each time we click on the down-button`, () => {
        for (let i = 0; i < slides; i++) {
            cy.matchImageSnapshot(`datatype${i}`);
            cy.get(".down-button").click();
        }
    });

    it(`should change of slide each time we shipe up on the screen`, () => {
        for (let i = 0; i < slides; i++) {
            cy.matchImageSnapshot(`datatype${i}`);
            cy.get(".swiper-slide-active")
                .trigger("pointerdown", "bottom", { which: 1 })
                .trigger("pointermove", "center")
                .trigger("pointerup", { force: true });
        }
    });

    it(`should be able to read the information "How to read this" from the slides 0, 2, 4, 5, 6, 7, 8 and 10`, () => {
        for (let i = 0; i < slides; i++) {
            if (slidesWithInfo.includes(i)) {
                cy.get(".swiper-slide-active").invoke("css", "display", "none");
                cy.get(".static-content > .data-sharing-legend").click();
                cy.matchImageSnapshot(`datatypeinfo${i}`);
                cy.get("button").click();
            }

            cy.get(".down-button").click();
        }
    });
});
