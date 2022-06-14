import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../analysisKeys";
import moment from "moment";

const MIN_MORNING = 5;
const MAX_MORNING = 10;
const SLEEP_DURATION = 5;

export default class AwakeningLocationAnalysis extends RootAnalysis {
    convertToDateString(date) {
        return (
            date.getDate() +
            "-" +
            (date.getUTCMonth() + 1) +
            "-" +
            date.getFullYear()
        );
    }
    containsWakingHours(startDate, endDate, daysDiff) {
        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        if (daysDiff > 1) return true;
        if (endHour <= MIN_MORNING) {
            return false;
        }
        if (daysDiff == 0) {
            if (startHour <= MIN_MORNING && endHour <= MIN_MORNING)
                return false;
            if (startHour >= MIN_MORNING) return false;
        }

        // //slept in the early hours
        // if (startHour <= MIN_MORNING) {
        //     if (endHour >= MIN_MORNING) return true;
        //     return false;
        // }
        // //if they got to the location in that morning we don't consider that they went there to sleep
        // if (startHour <= MAX_MORNING && daysDiff == 0) {
        //     return false;
        // }
        // //in the case the start hour is larger than MAX_MORNING they must've slept in the previous day
        // if (endHour >= MAX_MORNING && daysDiff > 0) {
        //     const tempDate = new Date(startDate);
        //     tempDate.setDate(startDate.getDate() + daysDiff);
        //     if (tempDate.getDate() === endDate.getDate()) {
        //         return true;
        //     }
        // }

        return true;
    }

    getDateDiff(startDate, endDate) {
        const momentStart = moment(startDate).startOf("day");
        const momentEnd = moment(endDate).startOf("day");
        return momentEnd.diff(momentStart, "days");
    }

    isMorningLocation(location) {
        const dates = {};
        //Check if this is a place the user slept in or was just in transit
        if (
            location.unixEndTimestamp - location.unixStartTimestamp <
            SLEEP_DURATION * 60 * 60 * 1000
        )
            return false;

        const startDate = new Date(location.unixStartTimestamp);
        const endDate = new Date(location.unixEndTimestamp);
        const daysDiff = this.getDateDiff(startDate, endDate);
        if (!this.containsWakingHours(startDate, endDate, daysDiff))
            return dates;
        //In the case the waking hours are contained in the location but the user slept in the morning
        if (daysDiff == 0)
            dates[this.convertToDateString(endDate)] = { location };
        //checks for all dates spent at location
        for (let i = 0; i < daysDiff; i++) {
            startDate.setDate(startDate.getDate() + 1);
            const dateString = this.convertToDateString(startDate);
            dates[dateString] = { location };
        }
        return dates;
    }

    isFirstActivity(activity, currentFirstActivity) {
        if (
            activity.timestamp.getTime() <
            currentFirstActivity.timestamp.getTime()
        ) {
            return activity;
        }
        return currentFirstActivity;
    }

    async analyze({ dataAccount: googleAccount }) {
        let dateDataObject = {};
        const locationTimeline = googleAccount.placeVisits;
        const activityTimeline = googleAccount.activities;
        locationTimeline.forEach((location) => {
            const newDateData = this.isMorningLocation(location);
            if (newDateData)
                dateDataObject = { ...dateDataObject, ...newDateData };
        });
        // Narrow down activities that happened in the morning
        const morningActivities = activityTimeline.filter(
            (activity) =>
                activity.timestamp.getHours() > MIN_MORNING &&
                activity.timestamp.getHours() < MAX_MORNING
        );

        morningActivities.forEach((activity) => {
            const activityDateString = this.convertToDateString(
                activity.timestamp
            );
            const currentDateData = dateDataObject[activityDateString];
            //No place registered for this morning
            if (currentDateData === undefined) return;
            const currentFirstActivity = dateDataObject.isFirstActivity || {
                timestamp: new Date(),
            };
            dateDataObject[activityDateString] = {
                ...currentDateData,
                firstActivity: this.isFirstActivity(
                    activity,
                    currentFirstActivity
                ),
            };
        });
        if (Object.keys(dateDataObject).length > 0)
            googleAccount.analyses[analysisKeys.awakeningAnalysis] =
                dateDataObject;
    }
}
