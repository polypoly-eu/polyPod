const polyPediaReportUrl = process.env.POLYPOD_POLYPEDIA_REPORT_URL;
const polyPediaReportAuth =
    process.env.POLYPOD_POLYPEDIA_REPORT_BASICAUTH_USERPASS_PLAINTEXT;

const fallbackURL = "https://localhost:8000";
const fallbackAuth = "";

export default {
    "polyPediaReport/facebook": {
        url: polyPediaReportUrl || fallbackURL + "/facebook",
        auth: polyPediaReportAuth || fallbackAuth,
    },
    "polyPediaReport/google": {
        url: polyPediaReportUrl || fallbackURL + "/google",
        auth: polyPediaReportAuth || fallbackAuth,
    },
    polyApiErrorReport: {
        url:
            process.env.POLYPOD_ERROR_REPORT_URL ||
            fallbackURL + "/errorReport",
        auth: process.env.POLYPOD_ERROR_REPORT_AUTHORIZATION || fallbackAuth,
    },
    demoTest: {
        url: "",
        allowInsecure: true,
    },
};
