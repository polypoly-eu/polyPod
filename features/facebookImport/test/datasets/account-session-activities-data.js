import {
    SESSION_ACTIVITIES_DATA_KEY,
    SESSION_ACTIVITIES_FILE_PATH,
} from "../../src/model/importers/account-session-activities-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    totalEventsCount: 8,
};

export function wrapSessionActivitiesData(data) {
    return { [SESSION_ACTIVITIES_DATA_KEY]: data };
}

export function createSessionActivitiesDataset() {
    return wrapSessionActivitiesData([
        {
            timestamp: 1615604089,
            action: "Session updated",
            ip_address: "54.134.214.59",
            user_agent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36",
            datr_cookie: "G3R3********************",
            city: "Munich",
            region: "Bavaria",
            country: "DE",
            site_name: "www.facebook.com",
        },
        {
            timestamp: 1480560893,
            action: "Login",
            ip_address: "54.134.214.59",
            user_agent:
                "Mozilla/5.0 (Linux; Android 8.0.0; SM-G950F Build/R16NW) ",
            datr_cookie: "s43g********************",
            city: "Munich",
            region: "Bavaria",
            country: "DE",
            site_name: "www.facebook.com",
        },
        {
            timestamp: 1633217120,
            action: "Attempted Adding CC",
            ip_address: "194.34.111.129",
            user_agent:
                "Mozilla/5.0 (Linux; Android 8.0.0; SM-G950F Build/R16NW) ",
            datr_cookie: "s43g********************",
            city: "Berlin",
            region: "Berlin",
            country: "DE",
            site_name: "www.facebook.com",
        },
        {
            timestamp: 1544429392,
            action: "Session updated",
            ip_address: "54.134.214.59",
            user_agent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36",
            datr_cookie: "G3R3********************",
            city: "Berlin",
            region: "Berlin",
            country: "DE",
            site_name: "www.facebook.com",
        },
        {
            timestamp: 1449805123,
            action: "Login",
            ip_address: "54.134.214.59",
            user_agent:
                "Dalvik/2.1.0 (Linux; U; Android 11; SM-G991B Build/RP1A.200720.012)",
            datr_cookie: "G3R3********************",
            city: "Stuttgart",
            region: "Baden-Württemberg",
            country: "DE",
            site_name: "www.facebook.com",
        },
        {
            timestamp: 1426321546,
            action: "Session updated",
            ip_address: "194.34.111.129",
            user_agent:
                "Dalvik/2.1.0 (Linux; U; Android 11; SM-G991B Build/RP1A.200720.012)",
            datr_cookie: "G3R3********************",
            city: "Munich",
            region: "Bavaria",
            country: "DE",
            site_name: "www.facebook.com",
        },
        {
            timestamp: 1422884909,
            action: "Session updated",
            ip_address: "194.34.111.129",
            user_agent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36",
            datr_cookie: "abds********************",
            city: "Berlin",
            region: "Berlin",
            country: "DE",
            site_name: "www.facebook.com",
        },
        {
            timestamp: 1563401662,
            action: "Web Session Terminated",
            ip_address: "54.134.214.59",
            user_agent:
                "Mozilla/5.0 (Linux; Android 8.0.0; SM-G950F Build/R16NW) ",
            datr_cookie: "s43g********************",
            city: "Stuttgart",
            region: "Baden-Württemberg",
            country: "DE",
            site_name: "www.facebook.com",
        },
    ]);
}

export function zipFileWithSessionActivities() {
    return createMockedZip([
        [SESSION_ACTIVITIES_FILE_PATH, createSessionActivitiesDataset()],
    ]);
}

export function zipFileWithSessionActivitiesAndExpectedValues() {
    return {
        zipFile: zipFileWithSessionActivities(),
        expectedValues: DATASET_EXPECTED_VALUES,
    };
}
