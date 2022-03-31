var polyImport = (function (exports, React) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    /**
     * An utility class for measuring time duration.
     *
     * @class
     */
    class Telemetry {
        constructor() {
            this._creationTime = performance.now();
        }

        elapsedTime() {
            return performance.now() - this._creationTime;
        }
    }

    function createSuccessStatus() {
        return {
            name: "SUCCESS",
            isSuccess: true,
        };
    }

    function createErrorStatus(error) {
        return {
            name: "ERROR",
            error,
            message: error.name,
            isError: true,
        };
    }

    /**
     * I am a "fake" analysis that shows issues when running analyses.
     * I do not have an analyse method as I get the data directly in the constructor.
     *
     * I provide the same API as an analysis that should be included in a report.
     *
     * @class
     */
    class InactiveCardsSummary {
        constructor(analysesResults) {
            const inactiveAnalysesResults = analysesResults.filter(
                ({ analysis, status }) => status.isError || !analysis.active
            );

            this._inactiveAnalysesData = inactiveAnalysesResults.map(
                ({ analysis, status }) => {
                    return {
                        analysis: analysis.id,
                        activationStatus: analysis.active ? "ACTIVE" : "INACTIVE",
                        executionStatus: status.name,
                        message: status.message,
                    };
                }
            );
            this.active = this._inactiveAnalysesData.length > 0;
        }

        get title() {
            return "Inactive Analyses";
        }

        get id() {
            return this.constructor.name;
        }

        get jsonReport() {
            return {
                id: this.id,
                data: this._inactiveAnalysesData,
            };
        }

        render() {
            return (
                React__default["default"].createElement(React__default["default"].Fragment, null
                    , React__default["default"].createElement('p', null, "Analyses that were not activated. This is a technical view giving details of why the view was not active."


                    )
                    , React__default["default"].createElement('table', null
                        , React__default["default"].createElement('tbody', null
                            , this._inactiveAnalysesData.map(
                                (
                                    {
                                        executionStatus,
                                        activationStatus,
                                        analysis,
                                        message,
                                    },
                                    index
                                ) => (
                                    React__default["default"].createElement('tr', { key: index,}
                                        , React__default["default"].createElement('td', null, analysis)
                                        , React__default["default"].createElement('td', null, executionStatus)
                                        , React__default["default"].createElement('td', null, activationStatus)
                                        , React__default["default"].createElement('td', null, message)
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }

    /**
     * I am a "fake" analysis that shows the status of running analyses.
     * I do not have an analyse method as I get the data directly in the constructor.
     *
     * I provide the same API as an analysis that should be included in a report.
     *
     * @class
     */
    class MinistoriesStatusAnalysis {
        constructor(analysesResults) {
            this._analysesData = analysesResults.map(
                (result) => result.reportJsonData
            );
            this.active = this._analysesData.length > 0;
        }

        get title() {
            return "Mini-stories status";
        }

        get id() {
            return this.constructor.name;
        }

        get jsonReport() {
            return {
                id: this.id,
                data: this._analysesData,
            };
        }

        render() {
            return (
                React__default["default"].createElement(React__default["default"].Fragment, null
                    , React__default["default"].createElement('p', null, "Status of all current ministories. This is a technical view giving details about the execution of ministories."


                    )
                    , React__default["default"].createElement('table', null
                        , React__default["default"].createElement('thead', null
                            , React__default["default"].createElement('tr', null
                                , React__default["default"].createElement('th', null, "Ministory")
                                , React__default["default"].createElement('th', null, "Execution Status" )
                                , React__default["default"].createElement('th', null, "Activation Status" )
                                , React__default["default"].createElement('th', null, "Message")
                                , React__default["default"].createElement('th', null, "Custom Data" )
                                , React__default["default"].createElement('th', null, "Execution Time" )
                            )
                        )
                        , React__default["default"].createElement('tbody', null
                            , this._analysesData.map(
                                (
                                    {
                                        analysisName,
                                        activationStatus,
                                        executionStatus,
                                        executionTime,
                                        customData,
                                    },
                                    index
                                ) => (
                                    React__default["default"].createElement('tr', { key: index,}
                                        , React__default["default"].createElement('td', null, analysisName)
                                        , React__default["default"].createElement('td', null, activationStatus)
                                        , React__default["default"].createElement('td', null, executionStatus.name)
                                        , React__default["default"].createElement('td', null, executionStatus.message)
                                        , React__default["default"].createElement('td', null
                                            , customData
                                                ? JSON.stringify(customData)
                                                : ""
                                        )
                                        , React__default["default"].createElement('td', { style: { textAlign: "right" },}
                                            , executionTime
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }

    class UnrecognizedData {
        constructor(analysesResults) {
            this._activeReportAnalyses = analysesResults
                .filter(
                    ({ analysis, status }) =>
                        status.isSuccess &&
                        analysis.isForDataReport &&
                        analysis.active
                )
                .map(({ analysis }) => analysis);

            const inactiveCardsSummary = new InactiveCardsSummary(analysesResults);
            if (inactiveCardsSummary.active) {
                this._activeReportAnalyses.push(inactiveCardsSummary);
            }

            const statusAnalysis = new MinistoriesStatusAnalysis(analysesResults);
            if (statusAnalysis.active) {
                this._activeReportAnalyses.push(statusAnalysis);
            }

            this.active = this._activeReportAnalyses.length > 0;
        }

        get reportAnalyses() {
            return this._activeReportAnalyses;
        }

        get report() {
            if (!this.active) {
                return "No data to report!";
            }
            return (
                this.reportAnalyses.length +
                " " +
                (this.reportAnalyses.length > 0 ? "analyses" : "analysis") +
                "  included in the report"
            );
        }

        get jsonReport() {
            if (!this.active) {
                return {};
            }

            const reportAnalyses = this.reportAnalyses.map(
                (analysis) => analysis.jsonReport
            );

            return { reportAnalyses_v1: reportAnalyses };
        }
    }

    class AnalysisExecutionResult {
        constructor(analysis, status, executionTime) {
            this._analysis = analysis;
            this._status = status || createSuccessStatus();
            this._executionTime = executionTime;
        }

        get analysis() {
            return this._analysis;
        }

        get status() {
            return this._status;
        }

        get executionTime() {
            return this._executionTime;
        }

        get reportJsonData() {
            return {
                analysisName: this.analysis.id,
                activationStatus: this.analysis.active ? "ACTIVE" : "INACTIVE",
                executionStatus: {
                    name: this.status.name,
                    message: this.status.message,
                },
                executionTime: this.executionTime.toFixed(0),
                customData: this.analysis.customReportData,
            };
        }
    }

    async function runAnalysis(analysisClass, enrichedData) {
        const subAnalysis = new analysisClass();

        const telemetry = new Telemetry();
        try {
            const status = await subAnalysis.analyze(enrichedData);
            return new AnalysisExecutionResult(
                subAnalysis,
                status,
                telemetry.elapsedTime()
            );
        } catch (error) {
            return new AnalysisExecutionResult(
                subAnalysis,
                createErrorStatus(error),
                telemetry.elapsedTime()
            );
        }
    }

    exports.UnrecognizedData = UnrecognizedData;
    exports.runAnalysis = runAnalysis;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, React);
