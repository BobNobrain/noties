const e = require('http-errors');

const JsonEndpoint = require('../rest/jsonendpoint');
// const Api = require('../rest/api');
const Connection = require('../mongo/connection.js');

const Entity = require('../models/entity');
const User = require('../models/user');

class LoginEndpoint extends JsonEndpoint
{
	constuctor()
	{
		super('/login');
	}

	post(req, res)
	{
		const login = req.body.login;
		const passw = req.body.password;

		const conn = Connection.getDefaultInstance();
		return conn
			.connect()
			.then(db => Entity.extract(db, User, {}))
			.then(users => 
			{
				conn.close();
				if (users.length === 1)
				{
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
