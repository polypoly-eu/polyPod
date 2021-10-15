export function expectActiveAnalysis(analysis) {
    expect(analysis.active).toBe(true);
}

export function expectAnalysisSuccessStatus(status) {
    expect(status.isSuccess).toBe(true);
}
