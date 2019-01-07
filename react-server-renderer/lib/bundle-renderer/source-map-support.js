var sourceMap = require("source-map");
var filenameRE = /\(([^)]+\.js):(\d+):(\d+)\)$/;
function createSourceMapConsumers(rawMaps) {
    var maps = {};
    Object.keys(rawMaps).forEach(function (file) {
        maps[file] = new sourceMap.SourceMapConsumer(rawMaps[file]);
    });
    return maps;
}
function rewriteErrorTrace(e, mapConsumers) {
    if (e && typeof e.stack === 'string') {
        e.stack = e.stack
            .split('\n')
            .map(function (line) {
            return rewriteTraceLine(line, mapConsumers);
        })
            .join('\n');
    }
}
function rewriteTraceLine(trace, mapConsumers) {
    var m = trace.match(filenameRE);
    var map = m && mapConsumers[m[1]];
    if (m != null && map) {
        var originalPosition = typeof(map.originalPositionFor) === 'function' ? map.originalPositionFor({
            line: Number(m[2]),
            column: Number(m[3])
        }) : {};
        if (originalPosition.source != null) {
            var source = originalPosition.source, line = originalPosition.line, column = originalPosition.column;
            var mappedPosition = "(" + source.replace(/^webpack:\/\/\//, '') + ":" + String(line) + ":" + String(column) + ")";
            return trace.replace(filenameRE, mappedPosition);
        }
        else {
            return trace;
        }
    }
    else {
        return trace;
    }
}
module.exports = {
    createSourceMapConsumers,
    rewriteErrorTrace,
}