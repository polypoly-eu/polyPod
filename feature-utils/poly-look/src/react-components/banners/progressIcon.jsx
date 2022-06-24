import React from "react";

/** Icon containing a dynamic svg representing 4 stages that change color
 *  based on the stage prop.
 * @param {Object} props
 * @param {number} [props.stage] - How many stages to fill in
 * using activeColor prop.
 * @param {string} [props.activeColor] - String representing a color to be used
 * for the active stages.
 * @param {string} [props.inactiveColor] - String representing a color to be used
 * for the inactive stages.
 * @returns {JSX.Element}
 */
export function ProgressIcon({
  stage,
  activeColor = "var(--color-indigo-950)",
  inactiveColor = "var(--color-gray-300)",
}) {
  function getFillColor(segmentNb) {
    if (segmentNb < stage) return activeColor;
    return inactiveColor;
  }
  const paths = [
    "M40 17.6216C39.7844 15.7872 39.3166 13.9875 38.607 12.2742C37.5966 9.83483 36.1156 7.61839 34.2486 5.7514C32.3816 3.88442 30.1652 2.40344 27.7258 1.39303C26.0125 0.683356 24.2128 0.215582 22.3784 0V5.07273C23.5511 5.25747 24.7005 5.58047 25.8023 6.03685C27.6318 6.79465 29.2941 7.90538 30.6944 9.30562C32.0946 10.7059 33.2053 12.3682 33.9632 14.1977C34.4195 15.2995 34.7425 16.449 34.9273 17.6216H40Z",
    "M27.7258 38.607C26.0125 39.3166 24.2128 39.7844 22.3784 40V34.9273C23.5511 34.7425 24.7005 34.4195 25.8023 33.9632C27.6318 33.2053 29.2941 32.0946 30.6944 30.6944C32.0946 29.2941 33.2053 27.6318 33.9632 25.8023C34.4195 24.7005 34.7425 23.5511 34.9273 22.3785H40C39.7844 24.2128 39.3166 26.0125 38.607 27.7258C37.5966 30.1652 36.1156 32.3816 34.2486 34.2486C32.3816 36.1156 30.1652 37.5966 27.7258 38.607Z",
    "M9.28283e-06 22.3785C0.215594 24.2128 0.683366 26.0125 1.39304 27.7258C2.40344 30.1652 3.88442 32.3816 5.75141 34.2486C7.61839 36.1156 9.83483 37.5966 12.2742 38.607C13.9875 39.3166 15.7872 39.7844 17.6216 40V34.9273C16.4489 34.7425 15.2995 34.4195 14.1977 33.9632C12.3682 33.2053 10.7059 32.0946 9.30563 30.6944C7.90539 29.2941 6.79466 27.6318 6.03685 25.8023C5.58047 24.7005 5.25748 23.5511 5.07274 22.3785H9.28283e-06Z",
    "M12.2742 1.39303C13.9875 0.683356 15.7872 0.215582 17.6216 0V5.07273C16.4489 5.25747 15.2995 5.58047 14.1977 6.03685C12.3682 6.79465 10.7059 7.90538 9.30563 9.30562C7.90539 10.7059 6.79466 12.3682 6.03685 14.1977C5.58046 15.2995 5.25747 16.449 5.07273 17.6216H0C0.21558 15.7872 0.683355 13.9875 1.39304 12.2742C2.40344 9.83483 3.88442 7.61839 5.75141 5.7514C7.61839 3.88442 9.83483 2.40344 12.2742 1.39303Z",
  ];

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths.map((path, index) => (
        <path key={index} d={path} fill={getFillColor(index)} />
      ))}
    </svg>
  );
}
