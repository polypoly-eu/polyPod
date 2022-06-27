import React, { useRef } from "react";
import "./listOfDetails.css";

const optimalGradientScrollingRatio = 0.84;

const ListOfDetails = ({ list }) => {
    const gradient = useRef();
    const listRef = useRef();
    const handleScroll = (e) => {
        if (
            e.target.scrollTop / e.target.scrollHeight >
            optimalGradientScrollingRatio
        ) {
            gradient.current.classList.remove("gradient");
        } else {
            gradient.current.classList.add("gradient");
        }
    };
    return (
        <div className="scrollable-list">
            <ul ref={listRef} onScroll={handleScroll}>
                {list.map((item, index) => {
                    return (
                        <li key={index}>
                            <span className="items">{item.primary}</span>
                            {item.secondary.map((secondary, i) => (
                                <div key={i} style={{ marginTop: "3px" }}>
                                    {secondary}
                                </div>
                            ))}
                        </li>
                    );
                })}
            </ul>
            <div className="list-gradient gradient" ref={gradient}></div>
        </div>
    );
};

export default ListOfDetails;
