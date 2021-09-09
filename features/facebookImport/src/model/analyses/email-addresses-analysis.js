import React from "react";
import RootAnalysis from "./root-analysis.js";

export default class EmailAddressesAnalysis extends RootAnalysis {
    get title() {
        return "Email addresses";
    }

    async analyze({ facebookAccount }) {
        this.active = facebookAccount.adminRecords.length > 0;
        this._emailAddresses = new Set();
        if (!this.active) {
            return;
        }

        facebookAccount.adminRecords.forEach((record) => {
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

    render() {
        return (
            <>
                Email addresses found in your export:
                <ul>
                    {[...this._emailAddresses].map((entry, index) => (
                        <li key={index}>{entry}</li>
                    ))}
                </ul>
            </>
        );
    }
}
