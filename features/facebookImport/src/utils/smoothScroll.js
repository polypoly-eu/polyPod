/**
 * A function to get smooth scrolling behaviour on all browsers (scroll-behaviour:smooth doesn't work in safari)
 * @param {string} childId - Dom element with ID that is being scrolled to
 * @param {string} [parentId] - Dom element with ID that is scrollable and parent of child element
 * @param {string[]} [topNavigationElementIds] - Array of Dom ID's that sit on top of the parent element (usually navigation elements)
 * @param {Object} [options] - Options regarding the scrolling behaviour
 * @param {string} [options.speed = 10] - Speed of the scrolling (in ms; smaller = faster)
 * @param {string} [options.step = 10] - Steps size of the scrolling (smaller = smoother but slower)
 */
export default function scrollSmoothly(
    childId,
    parentId,
    topNavigationElementIds,
    options
) {
    // scrolling constants
    const speed = options?.speed || 10;
    const step = options?.step || 10;

    const parent = document.getElementById(parentId) || document.body;
    const target = document.getElementById(childId);

    if (!(childId || target)) return;

    let totalTopNavElOffset = 0;
    if (topNavigationElementIds) {
        for (let topNavEl of topNavigationElementIds) {
            totalTopNavElOffset +=
                document.getElementById(topNavEl).offsetHeight;
        }
    }

    // get positions
    const parentPosition = parent.scrollTop;
    const targetPosition = target.offsetTop - totalTopNavElOffset;

    let timeoutQueuer = 0;
    // scroll down
    if (parentPosition < targetPosition) {
        for (let i = parentPosition; i <= targetPosition; i += step) {
            if (i + step > targetPosition) {
                setTimeout(function () {
                    parent.scrollTo(0, targetPosition);
                }, timeoutQueuer * speed);
            } else {
                setTimeout(function () {
                    parent.scrollTo(0, i);
                }, timeoutQueuer * speed);
            }
            timeoutQueuer++;
        }
    }

    // scroll up
    else {
        for (let i = parentPosition; i >= targetPosition; i -= step) {
            if (i - step < targetPosition) {
                setTimeout(function () {
                    parent.scrollTo(0, targetPosition);
                }, timeoutQueuer * speed);
            } else {
                setTimeout(function () {
                    parent.scrollTo(0, i);
                }, timeoutQueuer * speed);
            }
            timeoutQueuer++;
        }
    }
}
