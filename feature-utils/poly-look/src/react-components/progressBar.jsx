import React from "react";

import "./progressBar.css";

/**
 * A progress bar for data importer Features.
 *
 * @function
 * @param props
 * @param props.onUpdateImportStatus - Callback invoked when a section is clicked.
 * @param props.importSections - List of section names.
 * @returns {JSX.Element}
 */
const ProgressBar = ({ onUpdateImportStatus, importSections }) => {
  return (
    <div className="progress-bar" id="progress-bar">
      {importSections.map((section, index) => (
        <div
          onClick={() => onUpdateImportStatus(section)}
          key={index}
          className={`section`}
          data-testid="section-id"
        >
          <div className={`line ${section}-progress`}>
            <div className={`number ${section}-number`}>{index + 1}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
