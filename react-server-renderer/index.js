var createBundleRendererCreator = require("./lib/bundle-renderer/create-bundle-renderer");
var createRenderer = require("./lib/create-renderer");
process.env.REACT_ENV = 'server';
module.exports = {
  createRenderer,
  createBundleRenderer: createBundleRendererCreator(createRenderer),
}