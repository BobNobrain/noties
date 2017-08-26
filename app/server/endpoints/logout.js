const e = require('http-errors');

const JsonEndpoint = require('../rest/jsonendpoint');
// const Api = require('../rest/api');
const Connection = require('../mongo/connection.js');

const Entity = require('../models/entity');
const User = require('../models/user');

class LogoutEndpoint extends JsonEndpoint
{
	constructor()
	{
		super('/logout');
	}

	post(req, res)
	{
		req.session.userUuid = '';
		req.session.username = '';
		return { success: true };
	}
}

module.exports = LogoutEndpoint;
