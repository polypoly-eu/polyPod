// TODO real submission
export default async function submitAnswers(questionnaire): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const random = Math.random();
            if (random < 0.2)
                resolve();
            else
                reject();
        }, 1000);
    });
}
