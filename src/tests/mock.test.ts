import {podSpec} from "../specs/api";
import {MockPod} from "../mock";
// @ts-ignore
import fetch from "node-fetch";
import {Volume} from "memfs";

describe("Mock pod", () => {

    podSpec(
        () => new MockPod(
            new Volume().promises as any,
            fetch
        )
    );

});