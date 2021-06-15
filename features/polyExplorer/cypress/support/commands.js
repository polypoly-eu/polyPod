import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command";

addMatchImageSnapshotCommand({
    failureThreshold: 0.015,
    failureThresholdType: "percent",
    customDiffConfig: { threshold: 0.13 },
});
