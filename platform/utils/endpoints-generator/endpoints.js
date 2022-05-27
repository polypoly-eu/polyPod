const fallbackURL = "https://localhost:8000";
const fallbackAuth = "";

export default {
    "polyPediaReport/facebookImporter": {
        url:
            process.env.POLYPOD_POLYPEDIA_REPORT_URL ||
            fallbackURL + "/facebookImporter",
        auth:
            process.env.POLYPOD_POLYPEDIA_REPORT_AUTHORIZATION || fallbackAuth,
    },
    "polyPediaReport/google": {
        url:
            process.env.POLYPOD_POLYPEDIA_REPORT_URL || fallbackURL + "/google",
        auth:
            process.env.POLYPOD_POLYPEDIA_REPORT_AUTHORIZATION || fallbackAuth,
    },
    demoTest: {
        url: "",
        allowInsecure: true,
    },
};
