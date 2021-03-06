import React, { useState, useRef } from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";

import "./companySearch.css";

const CompanySearchScreen = ({ companies, onOpenInfo }) => {
    const [searchString, setSearchString] = useState("");
    const featuredComanies = companies.filter((e) => e.featured == true);

    const shownCompaniesUnsorted =
        searchString.length > 3 ||
        companies.filter((c) => c.name.toLowerCase().startsWith(searchString))
            .length == 0
            ? companies.filter((c) =>
                  c.name.toLowerCase().includes(searchString)
              )
            : companies.filter((c) =>
                  c.name.toLowerCase().startsWith(searchString)
              );

    const shownCompanies = shownCompaniesUnsorted.sort((a, b) =>
        a.name > b.name ? 1 : -1
    );
    const inputRef = useRef();

    const handleSearch = (inputString) => {
        setSearchString(inputString.toLowerCase());
    };

    const handleClear = () => {
        inputRef.current.value = "";
        setSearchString("");
        inputRef.current.focus();
    };

    return (
        <Screen className="company-search-screen">
            <div className="search-bar-container">
                <input
                    type="text"
                    ref={inputRef}
                    autoFocus="autofocus"
                    placeholder={i18n.t("companySearchScreen:typeHere")}
                    className="search-bar"
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {searchString == "" ? null : (
                    <button onClick={() => handleClear()}>
                        <img src="./images/clear-search.svg" />
                    </button>
                )}
            </div>
            <div className="company-search">
                {searchString == "" ? (
                    <div className="suggestion-container">
                        <p>{i18n.t("companySearchScreen:suggestions")}</p>
                        <div className="suggestions">
                            {" "}
                            {featuredComanies.map((company, index) => (
                                <button
                                    key={index}
                                    onClick={() => onOpenInfo(company.name)}
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
                                    {i18n.t("companySearchScreen:noMatch")}
                                </p>
                                <div className="suggestion-container">
                                    <p>
                                        {i18n.t(
                                            "companySearchScreen:suggestions"
                                        )}
                                    </p>
                                    <div className="suggestions">
                                        {" "}
                                        {featuredComanies.map(
                                            (company, index) => (
                                                <button
                                                    onClick={() =>
                                                        onOpenInfo(company.name)
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
                                        onClick={() => onOpenInfo(company.name)}
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
        </Screen>
    );
};

export default CompanySearchScreen;
