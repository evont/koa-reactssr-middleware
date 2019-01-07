var reactServer = require("react-dom/server");
var TemplateRenderer = require("./template-renderer");
var util = require("./util");
function createRenderer(options) {
    if (options === void 0) { options = {}; }
    var templateRenderer = new TemplateRenderer(options);
    return {
        renderToString: function (component, context, cb) {
            var _a;
            if (typeof context === 'function') {
                cb = context;
                context = {};
            }
            if (context) {
                templateRenderer.bindRenderFns(context);
            }
            // no callback, return Promise
            var promise;
            if (!cb) {
                ((_a = util.createPromiseCallback(), promise = _a.promise, cb = _a.cb));
            }
            var result;
            try {
                result = reactServer.renderToString(component);
                if (options.template) {
                    result = templateRenderer.renderSync(result, context);
                }
                cb(null, result);
            }
            catch (e) {
                cb(e);
            }
            return promise;
        },
        renderToStream: function (component, context) {
            var renderStream = reactServer.renderToNodeStream(component);
            process.nextTick(function () { return renderStream.emit('afterRender'); });
            if (!options.template) {
                return renderStream;
            }
            templateRenderer.bindRenderFns(context);
            var templateStream = templateRenderer.createStream(context);
            renderStream
                .on('afterRender', function () { return templateStream.emit('afterRender'); })
                .on('error', function (err) { return templateStream.emit('error', err); })
                .pipe(templateStream);
            return templateStream;
        }
    };
}
module.exports = createRenderer;