const e = require('http-errors');
const bcrypt = require('bcrypt');

const JsonEndpoint = require('../rest/jsonendpoint');
// const Api = require('../rest/api');
const Connection = require('../mongo/connection.js');

const Entity = require('../models/entity');
const User = require('../models/user');

const clearAuthAndThrow = req =>
{
	req.session.userUuid = '';
	throw new e.Unauthorized('Bad login/password');
}

class LoginEndpoint extends JsonEndpoint
{
	constructor()
	{
		super('/login');
	}

	post(req, res)
	{
		const username = req.body.username;
		const passw = req.body.password;

		let user = null;

		console.log(req.body);

		const conn = Connection.getDefaultInstance();
		return conn
			.connect()
			.then(db => Entity.extract(db, User, { username }))
			.then(users => 
			{
				conn.close();
				if (users.length === 1)
				{
					user = users[0];
					return bcrypt.compare(passw, users[0].password);
				}
				else
				{
					clearAuthAndThrow(req);
				}
			})
			.then(checkResult =>
			{
				if (checkResult)
				{
					req.session.userUuid = user.uuid;
					req.session.username = user.username;
					return { success: true };
				}
				else
				{
					clearAuthAndThrow(req);
				}
			})
		;
	}
}

module.exports = LoginEndpoint;
