import React, { useContext } from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import FilteredEntityList from "../../components/filteredEntityList/filteredEntityList.jsx";
import StoriesPreview from "../../components/storiesPreview/storiesPreview.jsx";

import "./main.css";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import { Tab, Tabs } from "@polypoly-eu/poly-look";

const MainScreen = () => {
    const { storiesMetadata } = useContext(ExplorerContext);

    return (
        <Screen
            noScroll
            className={"main-screen"}
            topShadow={false}
            theme="poly-theme-dark"
        >
            <div className="nav-button-container">
                <Tabs swipe autoHeight>
                    <Tab
                        id="discover"
                        label={i18n.t("mainScreen:tab.discover")}
                    >
                        <StoriesPreview storiesMetadata={storiesMetadata} />
                    </Tab>
                    <Tab id="explore" label={i18n.t("mainScreen:tab.explore")}>
                        <FilteredEntityList />
                    </Tab>
                </Tabs>
            </div>
        </Screen>
    );
};

export default MainScreen;
