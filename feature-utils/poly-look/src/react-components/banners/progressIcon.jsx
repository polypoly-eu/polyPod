import React from "react";

/**
 * Renders a progress icon containing a dynamic svg with
 * a number of segments equal to the number of stages in the process
 * that change color based on the stage prop.
 * @component
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
    "M18.3804 4.80754C17.8921 4.60532 17.3903 4.44125 16.8794 4.31621V0C17.9469 0.182784 18.9932 0.484364 19.9986 0.900788C21.7677 1.63358 23.3751 2.70764 24.7292 4.06166C26.0832 5.41568 27.1573 7.02314 27.89 8.79225C28.3064 9.79753 28.608 10.8438 28.7908 11.9113H24.4746C24.3495 11.4004 24.1855 10.8986 23.9833 10.4105C23.463 9.15441 22.7004 8.01312 21.7391 7.05177C20.7777 6.09041 19.6364 5.32782 18.3804 4.80754ZM28.9999 14.3724H29C29 14.3594 29 14.3465 28.9999 14.3336V14.3724Z",
    "M24.4747 16.8797C24.3496 17.3907 24.1855 17.8926 23.9833 18.3808C23.463 19.6369 22.7004 20.7782 21.7391 21.7395C20.7777 22.7009 19.6364 23.4635 18.3804 23.9838C17.8922 24.186 17.3903 24.3501 16.8794 24.4751L16.8794 28.7913C17.9469 28.6085 18.9933 28.3069 19.9986 27.8905C21.7677 27.1577 23.3752 26.0837 24.7292 24.7296C26.0832 23.3756 27.1573 21.7682 27.8901 19.9991C28.3065 18.9937 28.6081 17.9473 28.7909 16.8797L24.4747 16.8797ZM29 14.4523C29 14.4412 29 14.4301 29 14.4189H29V14.4523ZM14.4185 29.0005V29.0004H14.4623L14.4185 29.0005Z",
    "M0 16.8799C0.182785 17.9474 0.484363 18.9937 0.900782 19.999C1.63357 21.7681 2.70764 23.3756 4.06166 24.7296C5.41568 26.0836 7.02313 27.1577 8.79224 27.8905C9.79758 28.3069 10.8439 28.6085 11.9114 28.7913V24.4751C11.4005 24.35 10.8987 24.186 10.4105 23.9837C9.15441 23.4635 8.01311 22.7009 7.05176 21.7395C6.09041 20.7782 5.32782 19.6369 4.80754 18.3808C4.60532 17.8926 4.44125 17.3908 4.31622 16.8799L0 16.8799Z",
    "M8.79222 0.900788C9.79756 0.484364 10.8439 0.182784 11.9114 0V4.31621C11.4005 4.44125 10.8987 4.60532 10.4105 4.80754C9.15438 5.32782 8.01309 6.09041 7.05173 7.05177C6.09038 8.01312 5.32779 9.15441 4.80751 10.4105C4.60532 10.8986 4.44126 11.4004 4.31623 11.9113H0C0.182787 10.8438 0.484357 9.79753 0.900757 8.79225C1.63355 7.02314 2.70761 5.41568 4.06163 4.06167C5.41565 2.70765 7.02311 1.63358 8.79222 0.900788Z",
  ];

  return (
    <svg
      width="29"
      height="29"
      viewBox="0 0 29 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths.map((path, index) => (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          key={index}
          d={path}
          fill={getFillColor(index)}
        />
      ))}
    </svg>
  );
}
