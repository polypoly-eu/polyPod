import {DatasetSpec} from "../dataset";
import RDFJSDatasetCoreFactory from "@rdfjs/dataset";
import RDFJSDataFactory from "@rdfjs/data-model";

new DatasetSpec(
    RDFJSDatasetCoreFactory,
    RDFJSDataFactory
).run();
