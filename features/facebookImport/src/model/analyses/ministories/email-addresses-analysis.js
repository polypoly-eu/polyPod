import React from "react";
import BasicList from "../../../components/basicList/basicList.jsx";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class EmailAddressesAnalysis extends RootAnalysis {
    get title() {
        return "Email addresses and phone numbers";
    }

    async analyze({ dataAccount }) {
        this.active = dataAccount.adminRecords.length > 0;
        this._emailAddresses = new Set();
        if (!this.active) {
            return;
        }

        dataAccount.adminRecords.forEach((record) => {
            if (!record.extra_info) {
                return;
            }
            const extraInfo = record.extra_info;
            if (extraInfo.new_email) {
                this._emailAddresses.add(extraInfo.new_email);
            }
            if (extraInfo.old_email) {
                this._emailAddresses.add(extraInfo.old_email);
            }
        });
        this.active = this._emailAddresses.size > 0;
    }

    renderSummary() {
        return (
            <BasicList
                title={
                    "Email addresses and phone numbers found in your export."
                }
                items={[...this._emailAddresses]}
            />
        );
    }
}
