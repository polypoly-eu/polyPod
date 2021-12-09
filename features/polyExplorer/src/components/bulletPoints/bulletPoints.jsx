import React from "react";

import "./bulletPoints.css";

const BulletPoints = ({ bullets }) => {
    const addBulletPoints = () =>
        bullets.map((bullet, i) => (
            <li key={i}>
                <p dangerouslySetInnerHTML={{ __html: bullet }} />
            </li>
        ));

    return <ol className="bullet-points">{addBulletPoints()}</ol>;
};

export default BulletPoints;
