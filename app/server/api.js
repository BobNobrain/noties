const Api = require('./rest/api');

const TestEndpoint = require('./endpoints/test');
const PlansEndpoint = require('./endpoints/plans');
const NotiesEndpoint = require('./endpoints/noties');

const api = new Api('/api');

api.addEndpoint(new TestEndpoint());
api.addEndpoint(new PlansEndpoint());
api.addEndpoint(new NotiesEndpoint());


module.exports = api;
