export function expectActiveAnalysis(analysis) {
    expectAnalysisActivation(analysis, true);
}

export function expectInactiveAnalysis(analysis) {
    expectAnalysisActivation(analysis, false);
}

function expectAnalysisActivation(analysis, activeStatus) {
    expect(analysis.active).toBe(activeStatus);
}

export function expectAnalysisSuccessStatus(status) {
    expect(status.isSuccess).toBe(true);
}
