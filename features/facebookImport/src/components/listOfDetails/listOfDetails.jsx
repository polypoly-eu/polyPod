import React from "react";

import i18n from "../../i18n.js";

import "./listOfDetails.css";

const ListOfDetails = ({ intro, numberValue, list }) => (
    <div className="detail-view">
        <p
            className="intro"
            dangerouslySetInnerHTML={{
                __html: i18n.t(intro, {
                    number: numberValue,
                }),
            }}
        />
        <ul>
            {list.map((interest, index) => {
                return (
                    <li key={index}>
                        <span className="items">{interest}</span>
                    </li>
                );
            })}
        </ul>

        <p className="source">{i18n.t("common:source.your.facebook.data")}</p>
    </div>
);

export default ListOfDetails;
