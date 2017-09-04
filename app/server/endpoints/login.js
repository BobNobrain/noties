const e = require('http-errors');

const JsonEndpoint = require('../rest/jsonendpoint');
// const Api = require('../rest/api');
const Connection = require('../mongo/connection.js');

const Entity = require('../models/entity');
const User = require('../models/user');

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
					// TODO: check password
					req.session.userUuid = users[0].uuid;
					req.session.username = users[0].username;
					return { success: true };
				}
				else
				{
					req.session.userUuid = '';
					throw new e.Unauthorized('Bad login/password');
				}
			})
		;
	}
}

module.exports = LoginEndpoint;
