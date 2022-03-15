'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Decode = require('io-ts/lib/Decoder');
var Either = require('fp-ts/lib/Either');
var _function = require('fp-ts/function');
var semver = require('semver');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var Decode__namespace = /*#__PURE__*/_interopNamespace(Decode);

function expect(input, msg, decoder) {
    return _function.pipe(
        decoder.decode(input),
        Either.fold(
            (error) => {
                throw new Error(msg + "\n" + Decode__namespace.draw(error));
            },
            (t) => t
        )
    );
}

const relativeDecoder = _function.pipe(
    Decode__namespace.string,
    Decode__namespace.parse((string) => {
        if (typeof document == "undefined") {
            return Decode__namespace.success(string);
        }
        const url = new URL(string, document.location.href);
        if (url.toString() == "") return Decode__namespace.failure(string, "relative");

        return Decode__namespace.success(string);
    })
);

const mainDecoder = Decode__namespace.type({
    name: Decode__namespace.string,
    version: _function.pipe(
        Decode__namespace.string,
        Decode__namespace.parse((string) => {
            const parsed = semver.parse(string);
            if (parsed === null) return Decode__namespace.failure(string, "version string");

            return Decode__namespace.success(parsed);
        })
    ),
});

const featureDecoder = Decode__namespace.type({
    name: Decode__namespace.string,
    description: Decode__namespace.string,
    thumbnail: relativeDecoder,
    primaryColor: Decode__namespace.string,
    links: Decode__namespace.UnknownRecord,
    translations: Decode__namespace.UnknownRecord,
});

async function readManifest(packageManifest) {
    // There is no 'version' property in real feature manifests at this time, but to make this code
    // happy, we're simply adding one if it's missing.
    const manifestWithVersion = { ...packageManifest };
    if (!("version" in manifestWithVersion)) manifestWithVersion.version = "1.0.0";

    const rawMain = expect(manifestWithVersion, "Failed to parse main manifest", mainDecoder);
    const featureManifest = expect(
        manifestWithVersion,
        "Failed to parse Feature manifest",
        featureDecoder
    );

    return {
        name: featureManifest.name,
        version: rawMain.version,
        description: featureManifest.description,
        thumbnail: featureManifest.thumbnail,
        primaryColor: featureManifest.primaryColor,
        links: featureManifest.links,
        translations: featureManifest.translations,
    };
}

exports.readManifest = readManifest;
