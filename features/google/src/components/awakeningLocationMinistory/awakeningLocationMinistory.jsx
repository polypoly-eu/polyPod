import "./awakeningLocationMinistory.css";
import React, { useState } from "react";
import SourceInfoButton from "../sourceInfoButton/sourceInfoButton.jsx";
import i18n from "!silly-i18n";
import ListOfDetails from "../listOfDetails/listOfDetails.jsx";

export const AwakeningLocationSummary = ({ dateData }) => {
    const defaultDate = Object.entries(dateData).find(
        (entry) => !!entry[1].firstActivity
    )[0];
    const [selectedDate, setSelectedDate] = useState(defaultDate);
    const data = dateData[selectedDate];
    const dateSelection = false;
    const handleChangeDate = ({ target }) => {
        const formattedDate = target.value
            .split("-")
            .reverse()
            .map((e) => parseInt(e))
            .join("-");
        setSelectedDate(formattedDate);
    };
    //could be used to make the text more human later on
    // const week = [
    //     "Sunday",
    //     "Monday",
    //     "Tuesday",
    //     "Wednesday",
    //     "Thursday",
    //     "Friday",
    //     "Saturday",
    // ];
    return (
        <div className="awakening-location-ministory-summary ">
            {dateSelection ? (
                <div className="date-browser">
                    <label>
                        Enter a date:
                        <input
                            className="poly-theme-light"
                            type="date"
                            name="selectedDate"
                            max={Object.keys(dateData).pop()}
                            min={Object.keys(dateData)[0]}
                            required
                            pattern="\d{2}-\d{2}-\d{4}"
                            onInput={handleChangeDate}
                        />
                    </label>
                </div>
            ) : null}

            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t("awakeningLocation:summary", {
                        number_dates: Object.keys(dateData).length,
                    }),
                }}
            />
            {data ? (
                <>
                    <p> {i18n.t("awakeningLocation:summary2")}</p>
                    <p>{i18n.t("awakeningLocation:on")}</p>
                    <p className="highlighted-number">{selectedDate}</p>
                    {data.firstActivity ? (
                        <>
                            <p>{i18n.t("awakeningLocation:at")}</p>
                            <p className="highlighted-number">
                                {data.firstActivity.timestamp.getHours() +
                                    ":" +
                                    data.firstActivity.timestamp.getMinutes()}
                            </p>
                        </>
                    ) : null}
                    <p>{i18n.t("awakeningLocation:in")}</p>
                    <p className="highlighted-number" style={{ fontSize: 24 }}>
                        {data?.location.locationName}.
                    </p>
                    {i18n.t("awakeningLocation:summary3") === " " ? null : (
                        <p>{i18n.t("awakeningLocation:summary3")}</p>
                    )}
                </>
            ) : (
                <>
                    <p>{i18n.t("awakeningLocation:notFound")}</p>
                </>
            )}
        </div>
    );
};
export const AwakeningLocationDetails = ({ dateData }) => {
    const formatTime = (entry) => {
        let hours = entry.firstActivity?.timestamp.getHours();
        let minutes = entry.firstActivity?.timestamp.getMinutes();
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        return hours + ":" + minutes;
    };

    const allDataEntries = Object.entries(dateData).map((entry) => {
        const dataObj = {
            date: entry[0],
            location: entry[1].location.locationName,
            time: entry[1].firstActivity ? formatTime(entry[1]) : null,
        };
        return {
            primary: dataObj.date,
            secondary: [dataObj.time, dataObj.location],
        };
    });

    return (
        <div
            style={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
            className="awakening-location-ministory-details "
        >
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t("awakeningLocation:detail", {
                        number_dates: Object.keys(dateData).length,
                    }),
                }}
            />
            <p>{i18n.t("awakeningLocation:detail2")}</p>
            <p>{i18n.t("awakeningLocation:detail3")}</p>
            <p>{i18n.t("awakeningLocation:detail4")}</p>
            <ListOfDetails list={allDataEntries} />
            <SourceInfoButton
                source={i18n.t("common:your.google.data")}
                popUpProps={{ name: "info-awakening-location" }}
            />
        </div>
    );
};
