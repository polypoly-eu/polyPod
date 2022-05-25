import React from "react";
import { Infographic } from "@polypoly-eu/poly-look";
import i18n from "!silly-i18n";

const DataStructure = () => {
    return (
        <>
            <p>
                First paragraph Lorem ipsum dolor sit amet, consectetur
                adipiscingelit. Morbi volutpat, lectus vitae facilisis mattis,
                leo sem fringilla tortor, quis pharetra elit augue et orci
            </p>
            <Infographic
                imageSrc="./images/infographic/sankeyChart.svg"
                legend={["One", "Two"]}
            />
            <p>
                Second paragraph Lorem ipsum dolor sit amet, consectetur
                adipiscingelit. Morbi volutpat, lectus vitae facilisis mattis,
                leo sem fringilla tortor, quis pharetra elit augue et orci
            </p>
            <div className="poly-separator separator-space"></div>
            <h1 className="about-title"> about the data</h1>
            <p>
                last paragraph Lorem ipsum dolor sit amet, consectetur
                adipiscingelit. Morbi volutpat, lectus vitae facilisis mattis,
                leo sem fringilla tortor, quis pharetra elit augue et orci
            </p>
        </>
    );
};

export default DataStructure;
