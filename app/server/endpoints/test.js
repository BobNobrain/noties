const JsonEndpoint = require('../rest/jsonendpoint');
const e = require('http-errors');

class TestEndpoint extends JsonEndpoint
{
	constructor()
	{
		super('/teapot');
	}

	get(req, res)
	{
		throw e(418);
	}
}

module.exports = TestEndpoint;
