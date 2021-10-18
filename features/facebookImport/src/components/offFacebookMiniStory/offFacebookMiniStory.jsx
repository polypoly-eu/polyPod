import React from "react";
import i18n from "../../i18n";

import "./offFacebookMiniStory.css";

const OffFacebookMiniStory = ({ companiesCount, purchasesCount }) => {
    return (
        <div className="off-facebook-events-mini-story">
            <h2>{companiesCount}</h2>
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t("offFacebookEventsMiniStory:total", {
                        number_companies: companiesCount,
                        number_purchases: purchasesCount,
                    }),
                }}
            />
            <p className="source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
        </div>
    );
};

export default OffFacebookMiniStory;
