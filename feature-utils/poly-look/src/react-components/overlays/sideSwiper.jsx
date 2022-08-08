import React, { useEffect, useState, useRef } from "react";

import "./sideSwiper.css";

/**
 *
 * Generic container for HTRT side sheets or any other component that
 * slides from the right of the screen and can be closed either through
 * click, right or up sweep.
 * Note that during the in/out animations, interactions are disabled.
 * @param {Object} props
 * @param {boolean} [props.open] - Open or close the slide;
 * defaults to false.
 * @param {callback} [props.onClose] - Called after the exit animations end.
 * @param {string} [props.leftDistance] - Contents distance from the left
 * of the screen. Can be any value that is compatible with CSS calc rule;
 * defaults to 15vw.
 * @param {Array[number]} [props.backdropColor] - The backdrop color as a rgba array;
 * defaults to [0, 0, 0, 0.3].
 * @param {string} [props.animationDuration] - The duration of the animations.
 * Can be any value that is compatible with CSS transition-duration rule;
 * defaults to 0.6s.
 * @param {JSX.Element} [props.Component] - The component that will be animated.
 * If this component can trigger the SideSwiper to close then it must have
 * an onClose callback as one of it's props.
 * If it has clickable elements, then Event.stopPropagation()
 * must be called in the event's handler function, otherwise the Slider will close.
 * If the component has vertical scroll then it must accept custom styles.
 * @returns {JSX.Element}
 */

const SideSwiper = ({
  open = false,
  onClose,
  leftDistance = "15vw",
  backdropColor = [0, 0, 0, 0.3],
  animationDuration = "0.6s",
  Component,
}) => {
  let [red, green, blue, alpha] = backdropColor;
  let commonStyles = {
    duration: { transitionDuration: `${animationDuration}` },
    noInteraction: { pointerEvents: "none" },
    interaction: { pointerEvents: "auto" },
    backdropOut: { backgroundColor: `rgba(${red}, ${green}, ${blue}, 0)` },
    backdropIn: {
      backgroundColor: `rgba(${red}, ${green}, ${blue}, ${alpha})`,
    },
    contentsIn: { transform: `translateX(${leftDistance})` },
    contentsOutRight: { transform: `translateX(${window.innerWidth}px)` },
    backgroundTransition: { transition: "background-color" },
    contentsTransition: { transition: "transform" },
    noScroll: { overflowY: "hidden" },
  };
  const steps = {
    in: "in",
    interactive: "interactive",
    out: "out",
    outDone: "outDone",
  };
  const axes = {
    x: "x",
    y: "y",
  };
  const directions = {
    right: "right",
    left: "left",
    up: "up",
    down: "down",
  };

  const [step, updateStep] = useState(null);
  const [isPressing, updateMousePress] = useState(false);
  const [contentsStyle, updateContentsStyle] = useState(
    commonStyles.contentsOutRight
  );
  const [backdropStyle, updateBackdropStyle] = useState({});
  const [childScroll, updateChildScroll] = useState({});
  const [movement, updateMovement] = useState({
    startX: null,
    startY: null,
    currentX: null,
    currentY: null,
    direction: null,
  });
  const [axis, updateAxis] = useState("");
  const [animationsDoneCount, updateAnimationsStatus] = useState(0);
  const [contentsDOMRect, updateContentsDOMRect] = useState();
  const [alphaIncDist, updateAlphaIncDist] = useState(null);
  let contentsRef = useRef();

  useEffect(() => {
    updateContentsStyle({
      ...contentsStyle,
      width: `calc(${window.innerWidth}px - ${leftDistance})`,
    });

    updateBackdropStyle(commonStyles.backdropOut);
  }, []);

  useEffect(() => {
    if (open) {
      updateStep(steps.in);
    } else updateStep(steps.out);
  }, [open]);

  useEffect(() => {
    if (step == steps.in) {
      updateContentsStyle({
        ...contentsStyle,
        ...commonStyles.contentsIn,
        ...commonStyles.contentsTransition,
        ...commonStyles.duration,
      });
      updateBackdropStyle({
        ...commonStyles.backdropIn,
        ...commonStyles.backgroundTransition,
        ...commonStyles.duration,
        ...commonStyles.noInteraction,
      });
    }

    if (step == steps.interactive) {
      if (!contentsDOMRect) {
        let boundingRect = contentsRef.current.getBoundingClientRect();
        updateContentsDOMRect(boundingRect);
        updateAlphaIncDist(boundingRect.width / ((1 - alpha) * 100));
      }
      updateAnimationsStatus(0);
      updateBackdropStyle({
        ...backdropStyle,
        ...commonStyles.interaction,
      });
    }

    if (step == steps.out) {
      updateContentsStyle({
        ...contentsStyle,
        ...commonStyles.duration,
        ...commonStyles.contentsOutRight,
      });
      updateBackdropStyle({
        ...commonStyles.backdropOut,
        ...commonStyles.backgroundTransition,
        ...commonStyles.duration,
        ...commonStyles.noInteraction,
      });
    }

    if (step == steps.outDone) onClose();
  }, [step]);

  useEffect(() => {
    if (animationsDoneCount == 2) {
      if (step == steps.in) updateStep(steps.interactive);
      else if (step == steps.out || step == steps.outUp)
        updateStep(steps.outDone);
    }
  }, [animationsDoneCount]);

  useEffect(() => {
    if (isPressing)
      applyStyle(
        movement.startX - movement.currentX,
        movement.swipeY
          ? movement.swipeY - movement.currentY
          : movement.startY - movement.currentY
      );
  }, [movement]);

  function applyStyle(distanceX) {
    let xValue = -1 * distanceX + contentsDOMRect.x;

    switch (axis) {
      case axes.x: {
        updateChildScroll(commonStyles.noScroll);
        let alphaIncX = Math.floor(distanceX / alphaIncDist) * 0.1;
        updateContentsStyle({
          ...contentsStyle,
          transform: `translateX(${clamp(
            xValue,
            contentsDOMRect.x,
            contentsDOMRect.right
          )}px)`,
          transitionDuration: "0ms",
        });
        updateBackdropStyle({
          backgroundColor: `rgba(${red}, ${green}, ${blue},${clamp(
            alpha + alphaIncX,
            0.1,
            alpha
          )})`,
          transitionDuration: "10ms",
        });
        break;
      }
      case axes.y: {
        break;
      }
    }
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function touchStart(ev) {
    updateMovement({
      ...movement,
      startX: Math.round(ev.touches[0].pageX),
      startY: Math.round(ev.touches[0].pageY),
    });
    updateMousePress(true);
  }

  function touchMove(ev) {
    if (!isPressing) return;

    let x = Math.round(ev.touches[0].pageX);
    let y = Math.round(ev.touches[0].pageY);

    let distX = movement.startX - x;
    let distY = movement.startY - y;

    if (!axis) determineAxis(distX, distY);

    updateMovement({
      ...movement,
      currentX: x,
      currentY: y,
      direction: determineDirection(x, y),
    });
  }

  function determineAxis(distanceX, distanceY) {
    let axis;
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      axis = axes.x;
    } else {
      axis = axes.y;
    }
    updateAxis(axis);
  }

  function determineDirection(x, y) {
    let dir;
    if (axis == axes.x) {
      if (movement.currentX - x < 0) dir = directions.right;
      else dir = directions.left;
    } else {
      if (movement.currentY - y < 0) dir = directions.down;
      else dir = directions.up;
    }
    return dir;
  }

  function touchEnd() {
    updateMousePress(false);

    switch (axis) {
      case axes.x: {
        if (
          movement.direction == directions.right &&
          movement.currentX - movement.startX > contentsDOMRect.width / 2
        ) {
          updateStep(steps.out);
        } else reset();
        break;
      }
      case axes.y: {
        reset();
        break;
      }
    }
  }

  function reset() {
    updateContentsStyle({
      ...contentsStyle,
      ...commonStyles.contentsIn,
      ...commonStyles.duration,
    });
    updateBackdropStyle({
      ...commonStyles.backdropIn,
      ...commonStyles.backgroundTransition,
      ...commonStyles.duration,
    });
    updateChildScroll({});
    updateAxis("");
    updateMovement({
      startX: null,
      startY: null,
      currentX: null,
      currentY: null,
      direction: null,
    });
  }

  return (
    <div
      className="backdrop"
      onTransitionEnd={
        step == steps.interactive
          ? () => {}
          : () =>
              updateAnimationsStatus(
                (animationsDoneCount) => animationsDoneCount + 1
              )
      }
      style={backdropStyle}
      onClick={() => {
        updateStep(steps.out);
      }}
    >
      <div
        style={contentsStyle}
        className="contents"
        onTouchStart={touchStart}
        onTouchEnd={touchEnd}
        onTouchMove={touchMove}
        onTouchCancel={touchEnd}
        ref={contentsRef}
      >
        <Component onClose={() => updateStep(steps.out)} style={childScroll} />
      </div>
    </div>
  );
};

export default SideSwiper;
