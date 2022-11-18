import React from "react";
import BaseOverlay from "./base.jsx";

import "./loading.css";

/**
 * Overlay used when loading takes place
 * @component
 * @param {string} message - displayed below the image (GIF)
 * @param {string} loadingGif - link to image (GIF) in static files
 * @returns {JSX.Element} a BaseOverlay component with a loading gif and a message
 */
const LoadingOverlay = ({ message, loadingGif }) => (
  <BaseOverlay className="loading-overlay poly-content-centered">
    <img src={loadingGif} data-testid="img-test" />
    <p data-testid="message-test">{message}</p>
  </BaseOverlay>
);

export default LoadingOverlay;
