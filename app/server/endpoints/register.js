const e = require('http-errors');

const JsonEndpoint = require('../rest/jsonendpoint');
// const Api = require('../rest/api');
const Connection = require('../mongo/connection.js');

const Entity = require('../models/entity');
const User = require('../models/user');

class RegisterEndpoint extends JsonEndpoint
{
	constructor()
	{
		super('/register');
	}

	post(req, res)
	{
		const login = req.body.login;
		const passw = req.body.password;

		const newUser = new User({ username: login, password: passw });

		let success = false;

		const conn = Connection.getDefaultInstance();
		return conn
			.connect()
			.then(db => Entity.save(db, newUser))
			.then(result => 
			{
				conn.close();
				if (result.writeError)
				{
					if (result.writeError.code === Connection.DUPLICATE_KEY_ERROR)
					{
						throw e(409, 'This username is already taken!');
					}
					throw e(503);
				}
				if (result.nUpserted !== 1)
					throw e(500);
				return true;
			})
			.then(success =>
			{
				req.session.userUuid = users[0].uuid;
				req.session.username = users[0].username;
				return { success, user: newUser.toJSON() };
			})
		;
	}
}

module.exports = RegisterEndpoint;
