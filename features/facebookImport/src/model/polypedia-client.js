export function sendReport(data) {
    window.pod.network.httpPost(
        process.env.POLYPOD_POLYPEDIA_REPORT_URL,
        JSON.stringify(data),
        "application/json",
        process.env.POLYPOD_POLYPEDIA_REPORT_AUTHORIZATION
    );
}
