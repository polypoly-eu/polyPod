import React from "react";

import "./orderedList.css";

const OrderedList = ({ list }) => {
    const addBulletPoints = () =>
        list.map((bullet, i) => (
            <li key={i}>
                <p dangerouslySetInnerHTML={{ __html: bullet }} />
            </li>
        ));

    return <ol className="ordered-list">{addBulletPoints()}</ol>;
};

export default OrderedList;
