import {
    ADMIN_RECORDS_DATA_KEY,
    ADMIN_RECORDS_FILE_PATH,
} from "../../src/model/importers/admin-records-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    totalEventsCount: 6,
};

export function wrapAdminRecordsData(data) {
    return { [ADMIN_RECORDS_DATA_KEY]: data };
}

export function createAdminRecordssDataset() {
    return wrapAdminRecordsData([
        {
            event: "Checkpoint completed",
            session: {
                created_timestamp: 1508202312,
                ip_address: "74.41.213.119",
                user_agent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36",
                datr_cookie: "abds********************",
            },
        },
        {
            event: "Checkpoint completed",
            session: {
                created_timestamp: 1460142188,
                ip_address: "74.41.213.119",
                user_agent:
                    "Dalvik/2.1.0 (Linux; U; Android 11; SM-G991B Build/RP1A.200720.012)",
                datr_cookie: "G3R3********************",
            },
        },
        {
            event: "Checkpoint: Login-Approvals Enforcement",
            session: {
                created_timestamp: 1410594077,
                ip_address: "194.34.111.129",
                user_agent:
                    "Dalvik/2.1.0 (Linux; U; Android 11; SM-G991B Build/RP1A.200720.012)",
                datr_cookie: "G3R3********************",
            },
        },
        {
            event: "Checkpoint completed",
            session: {
                created_timestamp: 1526426841,
                ip_address: "54.134.214.59",
                user_agent:
                    "Mozilla/5.0 (Linux; Android 8.0.0; SM-G950F Build/R16NW) ",
                datr_cookie: "abds********************",
            },
        },
        {
            event: "Email change",
            session: {
                created_timestamp: 1538053851,
                ip_address: "74.41.213.119",
                user_agent:
                    "Dalvik/2.1.0 (Linux; U; Android 11; SM-G991B Build/RP1A.200720.012)",
                datr_cookie: "s43g********************",
            },
            extra_info: {
                old_name: "",
                new_name: "",
                old_number: "",
                new_number: "",
                old_vanity: "",
                new_vanity: "",
                old_email: "",
                new_email: "john-does@example.com",
            },
        },
        {
            event: "Email change",
            session: {
                created_timestamp: 1572727226,
                ip_address: "194.34.111.129",
                user_agent:
                    "Mozilla/5.0 (Linux; Android 8.0.0; SM-G950F Build/R16NW) ",
                datr_cookie: "s43g********************",
            },
            extra_info: {
                old_name: "",
                new_name: "",
                old_number: "",
                new_number: "",
                old_vanity: "",
                new_vanity: "",
                old_email: "john-does@example.com",
                new_email: "john@johndoe.com",
            },
        },
    ]);
}

export function zipFileWithAdminRecords() {
    return createMockedZip([
        [ADMIN_RECORDS_FILE_PATH, createAdminRecordssDataset()],
    ]);
}

export function zipFileWithAdminRecordsAndExpectedValues() {
    return {
        zipFile: zipFileWithAdminRecords(),
        expectedValues: DATASET_EXPECTED_VALUES,
    };
}
