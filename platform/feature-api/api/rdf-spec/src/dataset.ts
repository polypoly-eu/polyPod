/**
 * Executable specification for datasets. See [[DatasetSpec]] for details.
 *
 * @packageDocumentation
 */

import { BaseQuad, DataFactory, DatasetCore, DatasetCoreFactory, Quad } from "rdf-js";
import { assert } from "chai";
import { namespace } from "./namespace";

/**
 * Class containing test cases data factories. Use [[DatasetSpec.run]] to execute all tests.
 *
 * This class requires both a dataset factory and a data factory.
 *
 * The tests are composed of simple unit tests originating from the
 * [reference implementation](https://github.com/rdfjs-base/dataset).
 */
export class DatasetSpec<
  OutQuad extends BaseQuad = Quad,
  D extends DatasetCore<OutQuad> = DatasetCore<OutQuad>
> {
  constructor(
    private readonly datasetFactory: DatasetCoreFactory<OutQuad, OutQuad, D>,
    private readonly dataFactory: DataFactory<OutQuad>
  ) {}

  factory(): void {
    const ex = namespace("http://example.org/", this.dataFactory);

    describe("factory", () => {
      it("should be a function", () => {
        assert.strictEqual(typeof this.datasetFactory.dataset, "function");
      });

      it("should add the given Quads", () => {
        const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object1);
        const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object2);

        const dataset = this.datasetFactory.dataset([quad1, quad2]);

        assert(dataset.has(quad1));
        assert(dataset.has(quad2));
      });
    });
  }

  size(): void {
    const ex = namespace("http://example.org/", this.dataFactory);

    describe("size", () => {
      it("should be a number property", () => {
        const dataset = this.datasetFactory.dataset();

        assert.strictEqual(typeof dataset.size, "number");
      });

      it("should be 0 if there are no Quads in the Dataset", () => {
        const dataset = this.datasetFactory.dataset();

        assert.strictEqual(dataset.size, 0);
      });

      it("should be equal to the number of Quads in the Dataset", () => {
        const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object1);
        const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object2);
        const dataset = this.datasetFactory.dataset([quad1, quad2]);

        assert.strictEqual(dataset.size, 2);
      });
    });
  }

  add(): void {
    const ex = namespace("http://example.org/", this.dataFactory);

    describe("add", () => {
      it("should be a function", () => {
        const dataset = this.datasetFactory.dataset();

        assert.strictEqual(typeof dataset.add, "function");
      });

      it("should add the given Quad", () => {
        const quad = this.dataFactory.quad(ex.subject, ex.predicate, ex.object);
        const dataset = this.datasetFactory.dataset();

        dataset.add(quad);

        assert(dataset.has(quad));
      });

      it("should not add duplicate Quads", () => {
        const quadA = this.dataFactory.quad(ex.subject, ex.predicate, ex.object);
        const quadB = this.dataFactory.quad(ex.subject, ex.predicate, ex.object);
        const dataset = this.datasetFactory.dataset();

        dataset.add(quadA);
        dataset.add(quadB);

        assert.strictEqual(dataset.size, 1);
      });
    });
  }

  delete(): void {
    const ex = namespace("http://example.org/", this.dataFactory);

    describe("delete", () => {
      it("should be a function", () => {
        const dataset = this.datasetFactory.dataset();

        assert.strictEqual(typeof dataset.delete, "function");
      });

      it("should remove the given Quad", () => {
        const quad = this.dataFactory.quad(ex.subject, ex.predicate, ex.object);
        const dataset = this.datasetFactory.dataset([quad]);

        dataset.delete(quad);

        assert(!dataset.has(quad));
      });

      it("should remove only the given Quad", () => {
        const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object1);
        const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object2);
        const dataset = this.datasetFactory.dataset([quad1, quad2]);

        dataset.delete(quad1);

        assert(!dataset.has(quad1));
        assert(dataset.has(quad2));
      });

      it("should remove the Quad with the same SPOG as the given Quad", () => {
        const quad = this.dataFactory.quad(ex.subject, ex.predicate, ex.object);
        const quadCloned = this.dataFactory.quad(
          quad.subject,
          quad.predicate,
          quad.object,
          quad.graph
        );
        const dataset = this.datasetFactory.dataset([quad]);

        dataset.delete(quadCloned);

        assert(!dataset.has(quad));
      });
    });
  }

  has(): void {
    const ex = namespace("http://example.org/", this.dataFactory);

    describe("has", () => {
      it("should be a function", () => {
        const dataset = this.datasetFactory.dataset();

        assert.strictEqual(typeof dataset.has, "function");
      });

      it("should return false if the given Quad is not in the Dataset", () => {
        const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object1);
        const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object2);
        const dataset = this.datasetFactory.dataset([quad1]);

        assert(!dataset.has(quad2));
      });

      it("should return true if the given Quad is in the Dataset", () => {
        const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object1);
        const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object2);
        const dataset = this.datasetFactory.dataset([quad1, quad2]);

        assert(dataset.has(quad2));
      });
    });
  }

  match(): void {
    const ex = namespace("http://example.org/", this.dataFactory);

    describe("match", () => {
      it("should be a function", () => {
        const dataset = this.datasetFactory.dataset();

        assert.strictEqual(typeof dataset.match, "function");
      });

      it("should use the given subject to select Quads", () => {
        const quad1 = this.dataFactory.quad(ex.subject1, ex.predicate, ex.object);
        const quad2 = this.dataFactory.quad(ex.subject2, ex.predicate, ex.object);
        const dataset = this.datasetFactory.dataset([quad1, quad2]);

        const matches = dataset.match(ex.subject2);

        assert.strictEqual(matches.size, 1);
        assert(matches.has(quad2));
      });

      it("should use the given predicate to select Quads", () => {
        const quad1 = this.dataFactory.quad(ex.subject, ex.predicate1, ex.object);
        const quad2 = this.dataFactory.quad(ex.subject, ex.predicate2, ex.object);
        const dataset = this.datasetFactory.dataset([quad1, quad2]);

        const matches = dataset.match(null, ex.predicate2);

        assert.strictEqual(matches.size, 1);
        assert(matches.has(quad2));
      });

      it("should use the given object to select Quads", () => {
        const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object1);
        const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object2);
        const dataset = this.datasetFactory.dataset([quad1, quad2]);

        const matches = dataset.match(null, null, ex.object2);

        assert.strictEqual(matches.size, 1);
        assert(matches.has(quad2));
      });

      it("should use the given graph to select Quads", () => {
        const quad1 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object, ex.graph1);
        const quad2 = this.dataFactory.quad(ex.subject, ex.predicate, ex.object, ex.graph2);
        const dataset = this.datasetFactory.dataset([quad1, quad2]);

        const matches = dataset.match(null, null, null, ex.graph2);

        assert.strictEqual(matches.size, 1);
        assert(matches.has(quad2));
      });

      it("should return an empty Dataset if there are no matches", () => {
        const quad1 = this.dataFactory.quad(ex.subject1, ex.predicate, ex.object);
        const quad2 = this.dataFactory.quad(ex.subject2, ex.predicate, ex.object);
        const dataset = this.datasetFactory.dataset([quad1, quad2]);

        const matches = dataset.match(null, null, ex.object3);

        assert.strictEqual(matches.size, 0);
      });
    });
  }

  iterator(): void {
    const ex = namespace("http://example.org/", this.dataFactory);

    describe("Symbol.iterator", () => {
      it("should be a function", () => {
        const dataset = this.datasetFactory.dataset();

        assert.strictEqual(typeof dataset[Symbol.iterator], "function");
      });

      it("should return an iterator", () => {
        const quad1 = this.dataFactory.quad(ex.subject1, ex.predicate, ex.object);
        const quad2 = this.dataFactory.quad(ex.subject2, ex.predicate, ex.object);
        const dataset = this.datasetFactory.dataset([quad1, quad2]);

        const iterator = dataset[Symbol.iterator]();

        assert.strictEqual(typeof iterator.next, "function");
        assert.strictEqual(typeof iterator.next().value, "object");
      });

      it("should iterate over all Quads", () => {
        const quad1 = this.dataFactory.quad(ex.subject1, ex.predicate, ex.object);
        const quad2 = this.dataFactory.quad(ex.subject2, ex.predicate, ex.object);
        const dataset = this.datasetFactory.dataset([quad1, quad2]);

        const iterator = dataset[Symbol.iterator]();

        const output = this.datasetFactory.dataset();

        for (let item = iterator.next(); item.value; item = iterator.next()) {
          output.add(item.value);
        }

        assert.strictEqual(output.size, 2);
        assert(output.has(quad1));
        assert(output.has(quad2));
      });
    });
  }

  run(): void {
    this.factory();
    this.size();
    this.add();
    this.delete();
    this.has();
    this.match();
    this.iterator();
  }
}
