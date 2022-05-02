export default class RootAnalysis {
    get id() {
        return this.constructor.name;
    }

    get label() {
        return RootAnalysis.Labels.TECH_DEMO;
    }

    get customReportData() {
        return null;
    }
}
