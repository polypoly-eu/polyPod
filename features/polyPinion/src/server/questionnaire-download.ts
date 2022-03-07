import * as POD_ENV from "../env";

const { polyOut } = window.pod;

export async function downloadQuestionnaireData(questionnaireId: string): Promise<string> {
    const statusCheckEndpoint = POD_ENV.API_HOME + "questionnaire/" + questionnaireId + "/content";
    return timeoutPromise(
        10000,
        polyOut
            .fetch(statusCheckEndpoint, {
                headers: {
                    "User-Agent": userAgent(),
                },
            })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    const error = new Error(response.statusText);
                    throw error;
                }
            })
    );
}

export async function downloadQuestionnaireResults(questionnaireId: string): Promise<string> {
    const statusCheckEndpoint = POD_ENV.API_HOME + "questionnaire/" + questionnaireId + "/results";
    return timeoutPromise(
        10000,
        polyOut
            .fetch(statusCheckEndpoint, {
                headers: {
                    "User-Agent": userAgent(),
                },
            })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    const error = new Error(response.statusText);
                    throw error;
                }
            })
    );
}

export async function downloadActiveQuestionnairesMetadata(): Promise<string> {
    const statusCheckEndpoint = POD_ENV.API_HOME + "questionnaires";
    return timeoutPromise(
        10000,
        polyOut
            .fetch(statusCheckEndpoint, {
                headers: {
                    "User-Agent": userAgent(),
                },
            })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    const error = new Error(response.statusText);
                    throw error;
                }
            })
    );
}

//TODO implement timeout
function timeoutPromise<T>(timeout: number, promise: Promise<T>): Promise<T> {
    return promise;
}

//TODO implement agent with versionnumber
function userAgent(): string {
    return "PolyPoly";
}
