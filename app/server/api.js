const Api = require('./rest/api');

const TestEndpoint = require('./endpoints/test');
const PlansEndpoint = require('./endpoints/plans');
const NotiesEndpoint = require('./endpoints/noties');

const LoginEndpoint = require('./endpoints/login');
const LogoutEndpoint = require('./endpoints/logout');
const RegisterEndpoint = require('./endpoints/register');

const MeEndpoint = require('./endpoints/me');

const api = new Api('/api');

// entities
api.addEndpoint(new TestEndpoint());
api.addEndpoint(new PlansEndpoint());
api.addEndpoint(new NotiesEndpoint());

// "static objects"
api.addEndpoint(new MeEndpoint());

// sessions
api.addEndpoint(new LoginEndpoint());
api.addEndpoint(new LogoutEndpoint());
api.addEndpoint(new RegisterEndpoint());

module.exports = api;
