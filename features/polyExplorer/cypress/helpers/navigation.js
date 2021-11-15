export const INDEX_ROUTE = "dist/index.html";

export function startWithCompanies() {
    cy.visit(INDEX_ROUTE);
        cy.get(".button-container button")
            .click()
            .then(() => {
                return cy.get(".nav-button-container > :nth-child(2)").click();
            });
}

export function navigation(index, stopCondition, next) {
    cy.get(".swiper-slide-active").then(($activeSwiper) => {
        if (stopCondition($activeSwiper)) {
            return;
        }

        next(index).then(() => {
            navigation(++index, stopCondition, next);
        });
    });
}
