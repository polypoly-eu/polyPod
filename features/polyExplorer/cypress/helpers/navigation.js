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
