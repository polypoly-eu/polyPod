import React, { useState, useRef } from "react";
import "../screen.css";
import "./companySearchScreen.css";

const CompanySearchScreen = ({ companies, handleShowScreenChange }) => {
    const [searchString, setSearchString] = useState("");
    const featuredComanies = companies.filter((e) => e.featured == true);
    const shownCompanies = companies.filter((c) =>
        c.name.toLowerCase().includes(searchString)
    );
    const inputRef = useRef();

    const handleSearch = (inputString) => {
        setSearchString(inputString.toLowerCase());
    };

    const handleClear = () => {
        inputRef.current.value = "";
        setSearchString("");
    };

    return (
        <div className="explorer-container">
            <div className="screen-content">
                <div className="search-bar-container">
                    <input
                        type="text"
                        ref={inputRef}
                        autoFocus="autofocus"
                        placeholder="Type here"
                        className="search-bar"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {searchString == "" ? null : (
                        <button onClick={() => handleClear()}>x</button>
                    )}
                </div>
                <div className="company-search">
                    {searchString == "" ? (
                        <div className="suggestion-container">
                            <p>Suggestions</p>
                            <div className="suggestions">
                                {" "}
                                {featuredComanies.map((company, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleShowScreenChange(
                                                "companyInfo",
                                                company.name
                                            )
                                        }
                                    >
                                        {company.name}
                                    </button>
                                ))}{" "}
                            </div>
                        </div>
                    ) : (
                        <div>
                            {shownCompanies.length == 0 ? (
                                <div>
                                    <p className="no-answers">
                                        No Companies with that name yet, but
                                        more will come soon!
                                    </p>
                                    <div className="suggestion-container">
                                        <p>Suggestions</p>
                                        <div className="suggestions">
                                            {" "}
                                            {featuredComanies.map(
                                                (company, index) => (
                                                    <button
                                                        onClick={() =>
                                                            handleShowScreenChange(
                                                                "companyInfo",
                                                                company.name
                                                            )
                                                        }
                                                        key={index}
                                                    >
                                                        {company.name}
                                                    </button>
                                                )
                                            )}{" "}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {shownCompanies.map((company, index) => (
                                        <button
                                            onClick={() =>
                                                handleShowScreenChange(
                                                    "companyInfo",
                                                    company.name
                                                )
                                            }
                                            key={index}
                                        >
                                            {company.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanySearchScreen;
