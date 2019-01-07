var stream = require("stream");
var serializeJS = require("serialize-javascript");
var TemplateStream = (function (Transform) {
    function TemplateStream (
        renderer,
        template,
        context
    ) {
        Transform.call(this);
        this.started = false;
        this.renderer = renderer;
        this.template = template;
        this.context = context || {};
        this.inject = renderer.inject;
    }
    if ( Transform ) TemplateStream.__proto__ = Transform;
    TemplateStream.prototype = Object.create( Transform && Transform.prototype );
    TemplateStream.prototype.constructor = TemplateStream;

    TemplateStream.prototype._transform = function (data, _encoding, done) {
        if (!this.started) {
            this.emit('beforeStart');
            this.start();
        }
        this.push(data);
        done();
    };
    TemplateStream.prototype.start = function () {
        this.started = true;
        this.push(this.template.head(this.context));
        if (this.inject) {
            // inline server-rendered head meta information
            if (this.context.head) {
                this.push(this.context.head);
            }
            // inline preload/prefetch directives for initial/async chunks
            var links = this.renderer.renderResourceHints(this.context);
            if (links) {
                this.push(links);
            }
            // CSS files and inline server-rendered CSS collected by react-style-loader
            var styles = this.renderer.renderStyles(this.context);
            if (styles) {
                this.push(styles);
            }
        }
        this.push(this.template.neck(this.context));
        if (this.inject) {
            this.push('<div id="app">');
        }
    };
    TemplateStream.prototype._flush = function (done) {
        this.emit('beforeEnd', this.started);
        if (!this.started) {
            done();
            return;
        }
        if (this.inject) {
            this.push('</div>');
            var asyncContext = this.context.asyncContext;
            if (asyncContext) {
                this.push("<script>window.ASYNC_COMPONENTS_STATE=" + serializeJS(asyncContext.getState()) + "</script>");
            }
            // inline initial store state
            var state = this.renderer.renderState(this.context);
            if (state) {
                this.push(state);
            }
            // embed scripts needed
            var scripts = this.renderer.renderScripts(this.context);
            if (scripts) {
                this.push(scripts);
            }
        }
        this.push(this.template.tail(this.context));
        done();
    };
    return TemplateStream;
}(stream.Transform));
module.exports = TemplateStream;