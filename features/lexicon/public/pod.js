(function () {
    'use strict';

    /**
     * Abstract superclass for all term types defined in this module. It should not be subclassed outside of this module.
     *
     * This class defines a generic [[equals]] function according to the RDFJS specification.
     */
    class Model {
        

        equals(other) {
            if (!other || other.termType !== this.termType) return false;

            for (const [key, value] of Object.entries(this)) {
                const otherValue = (other )[key];
                if (value instanceof Model) {
                    if (!value.equals(otherValue)) return false;
                } else if (otherValue !== value) return false;
            }

            return true;
        }
    }

    class NamedNode extends Model  {
        __init() {this.termType = "NamedNode";}

        constructor( value) {
            super();this.value = value;NamedNode.prototype.__init.call(this);        Object.freeze(this);
        }
    }

    class BlankNode extends Model  {
         static __initStatic() {this.nextId = 0;}

        __init2() {this.termType = "BlankNode";}

        

        constructor(value) {
            super();BlankNode.prototype.__init2.call(this);
            if (value) this.value = value;
            else this.value = "b" + ++BlankNode.nextId;

            Object.freeze(this);
        }
    } BlankNode.__initStatic();

    class Literal extends Model  {
        static  __initStatic2() {this.langStringDatatype = new NamedNode(
            "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
        );}
        static  __initStatic3() {this.stringDatatype = new NamedNode("http://www.w3.org/2001/XMLSchema#string");}

        
        
        __init3() {this.termType = "Literal";}

        constructor( value, languageOrDatatype) {
            super();this.value = value;Literal.prototype.__init3.call(this);
            if (typeof languageOrDatatype === "string") {
                if (languageOrDatatype.indexOf(":") === -1) {
                    this.language = languageOrDatatype;
                    this.datatype = Literal.langStringDatatype;
                } else {
                    this.language = "";
                    this.datatype = new NamedNode(languageOrDatatype);
                }
            } else {
                this.language = "";
                this.datatype = languageOrDatatype || Literal.stringDatatype;
            }

            Object.freeze(this);
        }
    } Literal.__initStatic2(); Literal.__initStatic3();

    class Variable extends Model  {
        __init4() {this.termType = "Variable";}

        constructor( value) {
            super();this.value = value;Variable.prototype.__init4.call(this);        Object.freeze(this);
        }
    }

    class DefaultGraph extends Model  {
        static  __initStatic4() {this.instance = new DefaultGraph();}

         constructor() {
            super();DefaultGraph.prototype.__init5.call(this);DefaultGraph.prototype.__init6.call(this);        Object.freeze(this);
        }

        __init5() {this.termType = "DefaultGraph";}
        __init6() {this.value = "";}
    } DefaultGraph.__initStatic4();

    class Quad  {
        constructor(
             subject,
             predicate,
             object,
             graph
        ) {this.subject = subject;this.predicate = predicate;this.object = object;this.graph = graph;Quad.prototype.__init7.call(this);Quad.prototype.__init8.call(this);
            Object.freeze(this);
        }

        __init7() {this.termType = "Quad";}
        __init8() {this.value = "";}

        equals(other) {
            // `|| !other.termType` is for backwards-compatibility with old factories without RDF* support.
            return (
                !!other &&
                (other.termType === "Quad" || !other.termType) &&
                other.subject.equals(this.subject) &&
                other.predicate.equals(this.predicate) &&
                other.object.equals(this.object) &&
                other.graph.equals(this.graph)
            );
        }
    }

    const prototypes = {
        subject: [NamedNode.prototype, BlankNode.prototype, Variable.prototype, Quad.prototype],
        predicate: [NamedNode.prototype, Variable.prototype],
        object: [
            NamedNode.prototype,
            Literal.prototype,
            BlankNode.prototype,
            Variable.prototype,
            Quad.prototype,
        ],
        graph: [DefaultGraph.prototype, NamedNode.prototype, BlankNode.prototype, Variable.prototype],
    };

    /**
     * A spec-compliant implementation of an RDFJS data factory supporting variables.
     *
     * The type of quads generated is [[Quad]], which restricts the term types of subject, predicate, object and graph
     * appropriately. For example, it is not permitted to use a [[Literal]] in subject position.
     *
     * The values returned by this factory satisfy two additional assumptions:
     *
     * 1. They are direct instances of exported classes, such as [[BlankNode]].
     *    There is no manual fiddling with prototypes.
     * 2. Those exported classes are subclasses of [[Model]] (except [[Quad]]).
     *
     * These guarantees are important for users of the data factory who want to transmit the values across serialization
     * boundaries. The spec mandates that all entities come with a JVM-style `equals` method. Unfortunately, when
     * transporting JS objects through any kind of channel (`JSON.stringify`, `MessagePort`, `postMessage`, ...) they lose
     * their methods and prototype. It is hence crucial that the prototype can be restored by the receiver of such an
     * object. Sadly, the reference implementation makes that hard by not having dedicated classes; instead, when entities
     * are created, the prototype is manually constructed and subsequently not exposed. This implementation solves the
     * problem through the exported classes that can reattached after deserialization.
     *
     * All objects returned by this factory are frozen. The factory itself is frozen too.
     *
     * Optionally, strict validation of input can be enabled. This enforces that all terms that are passed in have been
     * generated by this library and that the types of the inputs are correct (which would otherwise be enforced through
     * TypeScript).
     *
     * For the semantics of the methods, refer to [the spec](https://rdf.js.org/data-model-spec/).
     */
    class DataFactory  {
        constructor(  strict) {this.strict = strict;
            Object.freeze(this);
        }

        blankNode(value) {
            if (this.strict) {
                if (value !== undefined && typeof value !== "string")
                    throw new Error("Expected string or undefined");
            }

            return new BlankNode(value);
        }

        defaultGraph() {
            return DefaultGraph.instance;
        }

        literal(value, languageOrDatatype) {
            if (this.strict) {
                if (typeof value !== "string") throw new Error("Expected string as value");

                if (
                    languageOrDatatype !== undefined &&
                    typeof languageOrDatatype !== "string" &&
                    Object.getPrototypeOf(languageOrDatatype) !== NamedNode.prototype
                )
                    throw new Error(
                        "Expected undefined, string or NamedNode prototype as language/datatype"
                    );
            }

            return new Literal(value, languageOrDatatype);
        }

        namedNode(value) {
            if (this.strict) {
                if (typeof value !== "string") throw new Error("Expected string");
            }

            return new NamedNode(value);
        }

        quad(
            subject,
            predicate,
            object,
            graph
        ) {
            if (this.strict) {
                if (!prototypes.subject.includes(Object.getPrototypeOf(subject)))
                    throw new Error("Invalid prototype of subject");
                if (!prototypes.predicate.includes(Object.getPrototypeOf(predicate)))
                    throw new Error("Invalid prototype of predicate");
                if (!prototypes.object.includes(Object.getPrototypeOf(object)))
                    throw new Error("Invalid prototype of object");
                if (graph !== undefined && !prototypes.graph.includes(Object.getPrototypeOf(graph)))
                    throw new Error("Invalid prototype of graph");
            }

            return new Quad(subject, predicate, object, graph || this.defaultGraph());
        }

        variable(value) {
            if (this.strict) {
                if (typeof value !== "string") throw new Error("Expected string");
            }

            return new Variable(value);
        }
    }

    /**
     * The default instance of [[DataFactory]].
     *
     * This instance does not perform strict validation of input.
     */
    const dataFactory = new DataFactory(false);

    function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }


    class LocalStoragePolyIn  {constructor() { LocalStoragePolyIn.prototype.__init.call(this); }
         static  __initStatic() {this.storageKey = "polyInStore";}
         __init() {this.store = JSON.parse(
            localStorage.getItem(LocalStoragePolyIn.storageKey) || "[]"
        );}

        async select(matcher) {
            if (["subject", "predicate", "object"].some((key) => key in matcher))
                throw "Not implemented: select with non-empty matcher";
            return this.store;
        }

        async add(...quads) {
            this.store.push(...quads);
            localStorage.setItem(
                LocalStoragePolyIn.storageKey,
                JSON.stringify(this.store)
            );
        }
    } LocalStoragePolyIn.__initStatic();

    /* eslint-disable @typescript-eslint/no-unused-vars */
    class ThrowingPolyOut  {
        fetch(input, init) {
            throw "Not implemented: fetch";
        }

        

        readFile(
            path,
            options
        ) {
            throw "Not implemented: readFile";
        }

        readdir(path) {
            throw "Not implemented: readdir";
        }

        stat(path) {
            throw "Not implemented: stat";
        }

        writeFile(
            path,
            content,
            options
        ) {
            throw "Not implemented: writeFile";
        }
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */

    class BrowserPolyNav  {constructor() { BrowserPolyNav.prototype.__init2.call(this); }
        
         __init2() {this.keyUpListener = null;}

        async openUrl(url) {
            console.log(`polyNav: Attempt to open URL: ${url}`);
        }

        async setActiveActions(actions) {
            const actionKeys = {
                Escape: "back",
                s: "search",
                i: "info",
            };
            if (this.keyUpListener)
                window.removeEventListener("keyup", this.keyUpListener);
            else {
                const actionUsage = Object.entries(actionKeys)
                    .map((pair) => `[${pair.join(" = ")}]`)
                    .join(", ");
                console.log(
                    `polyNav: Keyboard navigation available: ${actionUsage}`
                );
            }
            this.keyUpListener = ({ key }) => {
                const action = actionKeys[key];
                if (actions.includes(action)) _optionalChain([this, 'access', _ => _.actions, 'optionalAccess', _2 => _2[action], 'optionalCall', _3 => _3()]);
            };
            window.addEventListener("keyup", this.keyUpListener);
        }

        async setTitle(title) {
            document.title = title;
        }
    }

    class BrowserPod  {constructor() { BrowserPod.prototype.__init3.call(this);BrowserPod.prototype.__init4.call(this);BrowserPod.prototype.__init5.call(this);BrowserPod.prototype.__init6.call(this); }
          __init3() {this.dataFactory = dataFactory;}
          __init4() {this.polyIn = new LocalStoragePolyIn();}
          __init5() {this.polyOut = new ThrowingPolyOut();}
          __init6() {this.polyNav = new BrowserPolyNav();}
    }

    window.pod = new BrowserPod();

}());
