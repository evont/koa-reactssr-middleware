var fs = require("fs");
var path = require("path");
var stream = require("stream");
var util = require("../util");
var createBundleRunner = require("./create-bundle-runner");
var SourceMapSupport = require("./source-map-support");
var INVALID_MSG = 'Invalid server-rendering bundle format. Should be a string ' +
    'or a bundle Object of type:\n\n' +
    "{\n  entry: string;\n  files: { [filename: string]: string; };\n  maps: { [filename: string]: string; };\n}\n";
function createBundleRendererCreator(createRenderer) {
    return function createBundleRenderer(bundle, rendererOptions) {
        if (rendererOptions === void 0) { rendererOptions = {}; }
        var files;
        var entry;
        var maps;
        var basedir = rendererOptions.basedir;
        // load bundle if given filepath
        if (typeof bundle === 'string' &&
            /\.js(on)?$/.test(bundle) &&
            path.isAbsolute(bundle)) {
            if (fs.existsSync(bundle)) {
                var isJSON = /\.json$/.test(bundle);
                basedir = basedir || path.dirname(bundle);
                bundle = fs.readFileSync(bundle, 'utf-8');
                if (isJSON) {
                    try {
                        bundle = JSON.parse(bundle);
                    }
                    catch (e) {
                        throw new Error("Invalid JSON bundle file: " + bundle);
                    }
                }
            }
            else {
                throw new Error("Cannot locate bundle file: " + bundle);
            }
        }
        if (typeof bundle === 'object') {
            entry = bundle.entry;
            files = bundle.files;
            basedir = basedir || bundle.basedir;
            maps = SourceMapSupport.createSourceMapConsumers(bundle.maps);
            if (typeof entry !== 'string' || typeof files !== 'object') {
                throw new Error(INVALID_MSG);
            }
        }
        else if (typeof bundle === 'string') {
            entry = '__react_ssr_bundle__';
            files = { __react_ssr_bundle__: bundle };
            maps = {};
        }
        else {
            throw new Error(INVALID_MSG);
        }
        var renderer = createRenderer(rendererOptions);
        var run = createBundleRunner(entry, files, basedir, rendererOptions.runInNewContext);
        return {
            renderToString: function (context, cb) {
                var _a;
                if (typeof context === 'function') {
                    cb = context;
                    context = {};
                }
                var promise;
                if (!cb) {
                    ((_a = util.createPromiseCallback(), promise = _a.promise, cb = _a.cb));
                }
                run(context)["catch"](function (err) {
                    SourceMapSupport.rewriteErrorTrace(err, maps);
                    cb(err);
                }).then(function (app) {
                    if (app) {
                        renderer.renderToString(app, context, function (err, res) {
                            SourceMapSupport.rewriteErrorTrace(err, maps);
                            cb(err, res);
                        });
                    }
                });
                return promise;
            },
            renderToStream: function (context) {
                if (context === void 0) { context = {}; }
                var res = new stream.PassThrough();
                run(context)["catch"](function (err) {
                    SourceMapSupport.rewriteErrorTrace(err, maps);
                    // avoid emitting synchronously before user can
                    // attach error listener
                    process.nextTick(function () {
                        res.emit('error', err);
                    });
                })
                    .then(function (app) {
                    if (app) {
                        var renderStream = renderer.renderToStream(app, context);
                        renderStream.on('error', function (err) {
                            SourceMapSupport.rewriteErrorTrace(err, maps);
                            res.emit('error', err);
                        });
                        // relay HTMLStream special events
                        if (rendererOptions && rendererOptions.template) {
                            renderStream
                                .on('afterRender', function () { return res.emit('afterRender'); })
                                .on('beforeStart', function () { return res.emit('beforeStart'); })
                                .on('beforeEnd', function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                return res.emit.apply(res, ['beforeEnd'].concat(args));
                            });
                        }
                        renderStream.pipe(res);
                    }
                });
                return res;
            }
        };
    };
}
module.exports = createBundleRendererCreator;