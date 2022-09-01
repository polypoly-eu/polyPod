import UserActivity from "../entities/user-activity";
import ActivityFileInfo from "../entities/activity-file-info";
import { convertFileSizeUnit } from "./utils/importer-utils";
import BaseActivitiesImporter from "./base-activities-importer";
import dayjs from "dayjs";

class ActivityHtmlParser {
    constructor() {
        this._iframe = document.createElement("iframe");
        this._iframe.style.display = "none";
        document.body.appendChild(this._iframe);
    }

    _extractDate(text) {
        // Ignoring the timestamp for now - we don't need hourly accuracy at the
        // time of writing this.

        // Known formats:
        // 3 Feb 2001, 16:05:06 UTC
        // Feb 3, 2001, 4:05:06 PM UTC
        // 03.02.2001, 16:05:06 UTC
        let namedTimeOffsets = {
            A: "UTC+1",
            ACDT: "UTC+10:30",
            CDT: "UTC+13:45",
            CDST: "UTC-5",
            ACST: "UTC+9:30",
            CST: "UTC-5",
            ACT: "UTC+9:30/+10:30",
            ACWST: "UTC+8:45",
            ADT: "UTC-3",
            AST: "UTC-4",
            ADST: "UTC-8",
            HAA: "UTC-3",
            AEDT: "UTC+11",
            EDT: "UTC-4",
            EDST: "UTC-4",
            AEST: "UTC+10",
            EST: "UTC-5",
            AET: "UTC+10:00/+11:00",
            AFT: "UTC+4:30",
            AKDT: "UTC-8",
            AKST: "UTC-9",
            AT: "UTC-4:00/-3:00",
            ALMT: "UTC+6",
            AMST: "UTC+5",
            AMDT: "UTC+5",
            AMT: "UTC+4",
            ANAST: "UTC+12",
            ANAT: "UTC+12",
            AQTT: "UTC+5",
            ART: "UTC-3",
            HNA: "UTC-4",
            AWDT: "UTC+9",
            WDT: "UTC+9",
            WST: "UTC+1",
            AWST: "UTC+8",
            WAT: "UTC+1",
            AZOST: "UTC-1",
            AZODT: "UTC+0",
            AZOT: "UTC-1",
            AZST: "UTC+5",
            AZT: "UTC+4",
            AoE: "UTC-12",
            B: "UTC+2",
            BNT: "UTC+8",
            BDT: "UTC+1",
            BOT: "UTC-4",
            BRST: "UTC-2",
            BST: "UTC+1",
            BRT: "UTC-3",
            BT: "UTC-3",
            BDST: "UTC+1",
            BTT: "UTC+6",
            C: "UTC+3",
            CAST: "UTC+8",
            CAT: "UTC+2",
            CCT: "UTC+6:30",
            NACDT: "UTC-5",
            HAC: "UTC-5",
            CEST: "UTC+2",
            CEDT: "UTC+2",
            ECST: "UTC+2",
            MESZ: "UTC+2",
            CET: "UTC+1",
            ECT: "UTC-5",
            MEZ: "UTC+1",
            CHADT: "UTC+13:45",
            CHAST: "UTC+12:45",
            CHOST: "UTC+9",
            CHODT: "UTC+9",
            CHODST: "UTC+9",
            CHOT: "UTC+8",
            CHUT: "UTC+10",
            CIDST: "UTC-4",
            CIST: "UTC-5",
            CIT: "UTC-5",
            CKT: "UTC-10",
            CLST: "UTC-4",
            CLDT: "UTC-3",
            CLT: "UTC-4",
            CT: "UTC-6:00/-5:00",
            COT: "UTC-5",
            NACST: "UTC-6",
            HNC: "UTC-6",
            CVT: "UTC-1",
            CXT: "UTC+7",
            ChST: "UTC+10",
            GST: "UTC-2",
            D: "UTC+4",
            DAVT: "UTC+7",
            DDUT: "UTC+10",
            E: "UTC+5",
            EASST: "UTC-5",
            EADT: "UTC-5",
            EAST: "UTC-6",
            EAT: "UTC+3",
            NAEDT: "UTC-4",
            HAE: "UTC-4",
            EEST: "UTC+3",
            EEDT: "UTC+3",
            OESZ: "UTC+3",
            EET: "UTC+2",
            OEZ: "UTC+2",
            EGST: "UTC+0",
            EGT: "UTC-1",
            ET: "UTC-5:00/-4:00",
            NAEST: "UTC-5",
            HNE: "UTC-5",
            F: "UTC+6",
            FET: "UTC+3",
            FJST: "UTC+13",
            FJDT: "UTC+13",
            FJT: "UTC+12",
            FKST: "UTC-4",
            FKDT: "UTC-3",
            FKT: "UTC-4",
            FNT: "UTC-2",
            G: "UTC+7",
            GALT: "UTC-6",
            GAMT: "UTC-9",
            GET: "UTC+4",
            GFT: "UTC-3",
            GILT: "UTC+12",
            GMT: "UTC+0",
            UTC: "UTC",
            GT: "UTC+0",
            GYT: "UTC-4",
            H: "UTC+8",
            HDT: "UTC-9",
            HADT: "UTC-9",
            HKT: "UTC+8",
            HOVST: "UTC+8",
            HOVDT: "UTC+8",
            HOVDST: "UTC+8",
            HOVT: "UTC+7",
            HST: "UTC-10",
            HAST: "UTC-10",
            I: "UTC+9",
            ICT: "UTC+7",
            IDT: "UTC+4:30",
            IOT: "UTC+6",
            IRDT: "UTC+4:30",
            IRST: "UTC+3:30",
            IRKST: "UTC+9",
            IRKT: "UTC+8",
            IT: "UTC+5:30",
            IST: "UTC+2",
            JST: "UTC+9",
            K: "UTC+10",
            KGT: "UTC+6",
            KOST: "UTC+11",
            KRAST: "UTC+8",
            KRAT: "UTC+7",
            KST: "UTC+9",
            KT: "UTC+9",
            KUYT: "UTC+4",
            SAMST: "UTC+4",
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
            MDST: "UTC-6",
            NAMDT: "UTC-6",
            HAR: "UTC-6",
            MHT: "UTC+12",
            MMT: "UTC+6:30",
            MSD: "UTC+4",
            Moscow: "UTC+4",
            MSK: "UTC+3",
            MCK: "UTC+3",
            MST: "UTC+8",
            MT: "UTC-7:00/-6:00",
            NAMST: "UTC-7",
            HNR: "UTC-7",
            MUT: "UTC+4",
            MVT: "UTC+5",
            MYT: "UTC+8",
            N: "UTC-1",
            NCT: "UTC+11",
            NDT: "UTC-2:30",
            HAT: "UTC-2:30",
            NFDT: "UTC+12",
            NFT: "UTC+11",
            NOVST: "UTC+7",
            OMSST: "UTC+7",
            NOVT: "UTC+6",
            OMST: "UTC+6",
            NPT: "UTC+5:45",
            NRT: "UTC+12",
            NST: "UTC-3:30",
            HNT: "UTC-3:30",
            NUT: "UTC-11",
            NZDT: "UTC+13",
            NZST: "UTC+12",
            O: "UTC-2",
            ORAT: "UTC+5",
            P: "UTC-3",
            PDT: "UTC-7",
            PDST: "UTC-7",
            NAPDT: "UTC-7",
            HAP: "UTC-7",
            PET: "UTC-5",
            PETST: "UTC+12",
            PETT: "UTC+12",
            PGT: "UTC+10",
            PHOT: "UTC+13",
            PHT: "UTC+8",
            PST: "UTC-8",
            PKT: "UTC+5",
            PMDT: "UTC-2",
            PMST: "UTC-3",
            PONT: "UTC+11",
            PT: "UTC-8:00/-7:00",
            NAPST: "UTC-8",
            HNP: "UTC-8",
            PWT: "UTC+9",
            PYST: "UTC+8:30",
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
            SST: "UTC-11",
            SRET: "UTC+11",
            SRT: "UTC-3",
            SYOT: "UTC+3",
            T: "UTC-7",
            TAHT: "UTC-10",
            TFT: "UTC+5",
            KIT: "UTC+5",
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
            UYST: "UTC-2",
            UYT: "UTC-3",
            UZT: "UTC+5",
            V: "UTC-9",
            VET: "UTC-4",
            HLV: "UTC-4",
            VLAST: "UTC+11",
            VLAT: "UTC+10",
            VOST: "UTC+6",
            VUT: "UTC+11",
            EFATE: "UTC+11",
            W: "UTC-10",
            WAKT: "UTC+12",
            WARST: "UTC-3",
            WAST: "UTC+2",
            WEST: "UTC+1",
            WEDT: "UTC+1",
            WESZ: "UTC+1",
            WET: "UTC+0",
            WEZ: "UTC+0",
            WFT: "UTC+12",
            WGST: "UTC-2",
            WGT: "UTC-3",
            WIB: "UTC+7",
            WIT: "UTC+9",
            WITA: "UTC+8",
            ST: "UTC+13",
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

        // Replace named time offsets with UTC
        for (const [key, value] of Object.entries(namedTimeOffsets)) {
            const newText = text.replace(RegExp(` ${key}$`), " " + value);
            if (newText != text) {
                text = newText;
                break;
            }
        }

        let date = dayjs(text).$d;

        if (!date || date === null || date.toString() === "Invalid Date") {
            console.log(`Error: Unable to parse date format ${text}`);
        }

        return date;
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
        const content = await entry.getContent();
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
