const Api = require('./rest/api');

const TestEndpoint = require('./endpoints/test');
const PlansEndpoint = require('./endpoints/plans');

const api = new Api('/api');

api.addEndpoint(new TestEndpoint());
api.addEndpoint(new PlansEndpoint());

console.dir(api.endpoints[1].endpoints);


module.exports = api;
