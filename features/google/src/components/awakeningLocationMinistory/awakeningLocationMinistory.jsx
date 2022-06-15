import "./awakeningLocationMinistory.css";
import React, { useState } from "react";

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
        console.log(formattedDate);
    };

    const week = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

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
                    __html: `Your Google dataset contains ${
                        Object.keys(dateData).length
                    } matches of activities and locations that indicate where you started your day.`,
                }}
            />
            {data ? (
                <>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: `For example, it indicates that you woke up`,
                        }}
                    />
                    <p
                        dangerouslySetInnerHTML={{
                            __html: `On ${
                                week[data.location.endDate.getDay()]
                            }`,
                        }}
                    />
                    <p className="highlighted-number">{selectedDate}</p>
                    {data.firstActivity ? (
                        <>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: `At `,
                                }}
                            />
                            <p className="highlighted-number">
                                {data.firstActivity.timestamp.getHours() +
                                    ":" +
                                    data.firstActivity.timestamp.getMinutes()}
                            </p>
                        </>
                    ) : null}
                    <p>In</p>
                    <p className="highlighted-number" style={{ fontSize: 24 }}>
                        {data?.location.locationName}.
                    </p>
                </>
            ) : (
                <>
                    <p>Seems like google did not track you on this morning!</p>
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
        return {
            date: entry[0],
            location: entry[1].location.locationName,
            time: entry[1].firstActivity ? formatTime(entry[1]) : null,
        };
    });

    return (
        <div className="awakening-location-ministory-details ">
            <p
                dangerouslySetInnerHTML={{
                    __html: `Your Google dataset contains ${
                        Object.keys(dateData).length
                    } matches of activities and locations that indicate where you started your day. 
                    <br> Average users pick up their devices pretty much first thing in the morning. So it is pretty likely your first activity took place where you woke up. Maybe at home, in a hotel, or with someone you just met. 
                    <br> Knowing the location, the related residents or businesses,  and how often you are there, Google might make further assumptions. 
                    <br> Here is a full list of those matches:`,
                }}
            />
            {allDataEntries.map((dataEntry, i) => {
                return (
                    <div key={i}>
                        <p>{dataEntry.date}</p>
                        {dataEntry.time ? <p>{dataEntry.time}</p> : null}
                        <p>{dataEntry.location}</p>
                    </div>
                );
            })}
        </div>
    );
};
