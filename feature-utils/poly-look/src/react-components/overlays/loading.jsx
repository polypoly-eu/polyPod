import React from "react";
import BaseOverlay from "./base.jsx";

import "./loading.css";

/** Overlay used when loading takes place
 *
 * @param {String} message - displayed below the image (GIF)
 * @param {String} loadingGif - link to image (GIF) in static files
 * @returns jsx
 */
const LoadingOverlay = ({ message, loadingGif }) => (
  <BaseOverlay className="loading-overlay" centered={true}>
    <img src={loadingGif} data-testid="img-test" />
    <p data-testid="message-test">{message}</p>
  </BaseOverlay>
);

export default LoadingOverlay;
