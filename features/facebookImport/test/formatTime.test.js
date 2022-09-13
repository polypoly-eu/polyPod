import { formatTime } from "../src/utils/formatTime";

describe("Testing time formatting", () => {
    const englishFormat = "en-GB";
    const germanFormat = "de-DE";
    const longMonthsOption = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const weekdayOption = {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
    };
    const weekdayShortOption = {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
    };

    const testDate = "Tue, 26 Oct 2021 15:06:17 GMT";
    const date = new Date(testDate);
    const dateString = date.toUTCString();
    //seconds in android/ios
    const dateTime = date.getTime() / 1000;

    it("correctly converts to British English format", () => {
        expect(formatTime(date, englishFormat, longMonthsOption)).toBe(
            "26 October 2021"
        );
    });

    it("correctly converts to German format", () => {
        expect(formatTime(date, germanFormat, longMonthsOption)).toBe(
            "26. Oktober 2021"
        );
    });

    it("correctly converts to weekday format", () => {
        expect(formatTime(date, englishFormat, weekdayOption)).toBe(
            "Tuesday, 26 October 2021"
        );
    });

    it("correctly converts to short weekday format", () => {
        expect(formatTime(date, englishFormat, weekdayShortOption)).toBe(
            "Tue, 26 October 2021"
        );
    });

    it("correctly formats to numeric date", () => {
        expect(formatTime(date, englishFormat, longMonthsOption)).toBe(
            "26 October 2021"
        );
    });

    it("correctly formats with string input", () => {
        expect(formatTime(dateString, englishFormat, longMonthsOption)).toBe(
            "26 October 2021"
        );
    });

    it("correctly formats with time number input", () => {
        expect(formatTime(dateTime, englishFormat, longMonthsOption)).toBe(
            "26 October 2021"
        );
    });
});
