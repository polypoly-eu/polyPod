import UserActivity from "../entities/user-activity";
import ActivityFileInfo from "../entities/activity-file-info";
import { convertFileSizeUnit } from "./utils/importer-utils";
import BaseActivitiesImporter from "./base-activities-importer";
class ActivityHtmlParser {
    constructor() {
        this._iframe = document.createElement("iframe");
        this._iframe.style.display = "none";
        document.body.appendChild(this._iframe);
    }

    _extractDate(text) {
        // Ignoring the timestamp for now - we don't need hourly accuracy at the
        // time of writing this.
        const timeZoneMap = {
            A: "UTC+1",
            ACDT: "UTC+10:30",
            ACST: "UTC+9:30",
            ACT: "UTC+9:30/+10:30",
            ACWST: "UTC+8:45",
            ADT: "UTC-3",
            AEDT: "UTC+11",
            AEST: "UTC+10",
            AET: "UTC+10:00/+11:00",
            AFT: "UTC+4:30",
            AKDT: "UTC-8",
            AKST: "UTC-9",
            ALMT: "UTC+6",
            AMST: "UTC+5",
            AMT: "UTC+4",
            ANAST: "UTC+12",
            ANAT: "UTC+12",
            AQTT: "UTC+5",
            ART: "UTC-3",
            AST: "UTC-4",
            AT: "UTC-4:00/-3:00",
            AWDT: "UTC+9",
            AWST: "UTC+8",
            AZOST: "UTC+0",
            AZOT: "UTC-1",
            AZST: "UTC+5",
            AZT: "UTC+4",
            AoE: "UTC-12",
            B: "UTC+2",
            BNT: "UTC+8",
            BOT: "UTC-4",
            BRST: "UTC-2",
            BRT: "UTC-3",
            BST: "UTC+1",
            BTT: "UTC+6",
            C: "UTC+3",
            CAST: "UTC+8",
            CAT: "UTC+2",
            CCT: "UTC+6:30",
            CDT: "UTC-4",
            CEST: "UTC+2",
            CET: "UTC+1",
            CHADT: "UTC+13:45",
            CHAST: "UTC+12:45",
            CHOST: "UTC+9",
            CHOT: "UTC+8",
            CHUT: "UTC+10",
            CIDST: "UTC-4",
            CIST: "UTC-5",
            CKT: "UTC-10",
            CLST: "UTC-3",
            CLT: "UTC-4",
            COT: "UTC-5",
            CST: "UTC-5",
            CT: "UTC-6:00/-5:00",
            CVT: "UTC-1",
            CXT: "UTC+7",
            ChST: "UTC+10",
            D: "UTC+4",
            DAVT: "UTC+7",
            DDUT: "UTC+10",
            E: "UTC+5",
            EASST: "UTC-5",
            EAST: "UTC-6",
            EAT: "UTC+3",
            ECT: "UTC-5",
            EDT: "UTC-4",
            EEST: "UTC+3",
            EET: "UTC+2",
            EGST: "UTC+0",
            EGT: "UTC-1",
            EST: "UTC-5",
            ET: "UTC-5:00/-4:00",
            F: "UTC+6",
            FET: "UTC+3",
            FJST: "UTC+13",
            FJT: "UTC+12",
            FKST: "UTC-3",
            FKT: "UTC-4",
            FNT: "UTC-2",
            G: "UTC+7",
            GALT: "UTC-6",
            GAMT: "UTC-9",
            GET: "UTC+4",
            GFT: "UTC-3",
            GILT: "UTC+12",
            GMT: "UTC+0",
            GST: "UTC-2",
            GYT: "UTC-4",
            H: "UTC+8",
            HDT: "UTC-9",
            HKT: "UTC+8",
            HOVST: "UTC+8",
            HOVT: "UTC+7",
            HST: "UTC-10",
            I: "UTC+9",
            ICT: "UTC+7",
            IDT: "UTC+3",
            IOT: "UTC+6",
            IRDT: "UTC+4:30",
            IRKST: "UTC+9",
            IRKT: "UTC+8",
            IRST: "UTC+3:30",
            IST: "UTC+2",
            JST: "UTC+9",
            K: "UTC+10",
            KGT: "UTC+6",
            KOST: "UTC+11",
            KRAST: "UTC+8",
            KRAT: "UTC+7",
            KST: "UTC+9",
            KUYT: "UTC+4",
            L: "UTC+11",
            LHDT: "UTC+11",
            LHST: "UTC+10:30",
            LINT: "UTC+14",
            M: "UTC+12",
            MAGST: "UTC+12",
            MAGT: "UTC+11",
            MART: "UTC-9:30",
            MAWT: "UTC+5",
            MDT: "UTC-6",
            MHT: "UTC+12",
            MMT: "UTC+6:30",
            MSD: "UTC+4",
            MSK: "UTC+3",
            MST: "UTC-7",
            MT: "UTC-7:00/-6:00",
            MUT: "UTC+4",
            MVT: "UTC+5",
            MYT: "UTC+8",
            N: "UTC-1",
            NCT: "UTC+11",
            NDT: "UTC-2:30",
            NFDT: "UTC+12",
            NFT: "UTC+11",
            NOVST: "UTC+7",
            NOVT: "UTC+7",
            NPT: "UTC+5:45",
            NRT: "UTC+12",
            NST: "UTC-3:30",
            NUT: "UTC-11",
            NZDT: "UTC+13",
            NZST: "UTC+12",
            O: "UTC-2",
            OMSST: "UTC+7",
            OMST: "UTC+6",
            ORAT: "UTC+5",
            P: "UTC-3",
            PDT: "UTC-7",
            PET: "UTC-5",
            PETST: "UTC+12",
            PETT: "UTC+12",
            PGT: "UTC+10",
            PHOT: "UTC+13",
            PHT: "UTC+8",
            PKT: "UTC+5",
            PMDT: "UTC-2",
            PMST: "UTC-3",
            PONT: "UTC+11",
            PST: "UTC-8",
            PT: "UTC-8:00/-7:00",
            PWT: "UTC+9",
            PYST: "UTC-3",
            PYT: "UTC+8:30",
            Q: "UTC-4",
            QYZT: "UTC+6",
            R: "UTC-5",
            RET: "UTC+4",
            ROTT: "UTC-3",
            S: "UTC-6",
            SAKT: "UTC+11",
            SAMT: "UTC+4",
            SAST: "UTC+2",
            SBT: "UTC+11",
            SCT: "UTC+4",
            SGT: "UTC+8",
            SRET: "UTC+11",
            SRT: "UTC-3",
            SST: "UTC-11",
            SYOT: "UTC+3",
            T: "UTC-7",
            TAHT: "UTC-10",
            TFT: "UTC+5",
            TJT: "UTC+5",
            TKT: "UTC+13",
            TLT: "UTC+9",
            TMT: "UTC+5",
            TOST: "UTC+14",
            TOT: "UTC+13",
            TRT: "UTC+3",
            TVT: "UTC+12",
            U: "UTC-8",
            ULAST: "UTC+9",
            ULAT: "UTC+8",
            UTC: "UTC",
            UYST: "UTC-2",
            UYT: "UTC-3",
            UZT: "UTC+5",
            V: "UTC-9",
            VET: "UTC-4",
            VLAST: "UTC+11",
            VLAT: "UTC+10",
            VOST: "UTC+6",
            VUT: "UTC+11",
            W: "UTC-10",
            WAKT: "UTC+12",
            WARST: "UTC-3",
            WAST: "UTC+2",
            WAT: "UTC+1",
            WEST: "UTC+1",
            WET: "UTC+0",
            WFT: "UTC+12",
            WGST: "UTC-2",
            WGT: "UTC-3",
            WIB: "UTC+7",
            WIT: "UTC+9",
            WITA: "UTC+8",
            WST: "UTC+1",
            WT: "UTC+0",
            X: "UTC-11",
            Y: "UTC-12",
            YAKST: "UTC+10",
            YAKT: "UTC+9",
            YAPT: "UTC+10",
            YEKST: "UTC+6",
            YEKT: "UTC+5",
            Z: "UTC+0",
        };

        const datePattern =
            /([A-Z][a-z][a-z]) ([0-9]{1,2}), ([0-9]{4,4}), ([0-9:]{7,8} [A|P]M) ([A-Z]{3,4})/;
        const match = text.match(datePattern);
        const month = match?.[1];
        const day = match?.[2];
        const year = match?.[3];
        const time = match?.[4];
        const timezone = match?.[5];
        const utc_timezone = timeZoneMap[timezone];

        const dateString = `${day} ${month} ${year} ${time} ${utc_timezone}`;
        return dateString ? new Date(dateString) : null;
    }

    _scrapeTimestamps(contentDocument, productName) {
        const contentCells = contentDocument.querySelectorAll(
            ".mdl-grid>.mdl-cell>.mdl-grid>.content-cell:nth-child(2)"
        );
        return [...contentCells]
            .map(({ childNodes }) => {
                const timestamp = this._extractDate(
                    childNodes[childNodes.length - 1].textContent
                );
                if (!timestamp) return null;
                return new UserActivity({ timestamp, productName });
            })
            .filter((activity) => activity !== null);
    }

    async parse(entry) {
        console.log(
            `ActivityHtmlParser: Decoding entry at path: ${entry.path}`
        );
        const promise = entry.getContent();
        promise.catch((err) => {
            console.log(err);
        });
        const content = await promise;
        const text = await new TextDecoder("utf-8").decode(content);
        const { contentDocument } = this._iframe;
        contentDocument.write(text);
        contentDocument.close();
        const fileSize = convertFileSizeUnit(content.byteLength);
        const pathParts = entry.path.split("/");
        const productName = pathParts[pathParts.length - 2];
        console.log(
            `ActivityHtmlParser: Decoded entry at path: ${entry.path}, fileSize: ${fileSize}`
        );
        return {
            userActivity: this._scrapeTimestamps(contentDocument, productName),
            fileInfo: new ActivityFileInfo({
                productName,
                fileSize,
            }),
        };
    }

    release() {
        document.body.removeChild(this._iframe);
        this._iframe = null;
    }
}

export default class ActivitiesHtmlImporter extends BaseActivitiesImporter {
    constructor() {
        super(new ActivityHtmlParser());
    }
    async import({ zipFile, facebookAccount: googleAccount }) {
        await super.import({ zipFile, googleAccount });
        this._parser.release();
    }
}
