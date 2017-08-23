const Api = require('./rest/api');
const TestEndpoint = require('./endpoints/test');

const api = new Api('/api');

api.addEndpoint(new TestEndpoint());


module.exports = api;
