const e = require('http-errors');
const bcrypt = require('bcrypt');

const JsonEndpoint = require('../rest/jsonendpoint');
// const Api = require('../rest/api');
const Connection = require('../mongo/connection.js');

const Entity = require('../models/entity');
const User = require('../models/user');

const howManyTimes = 10;

class RegisterEndpoint extends JsonEndpoint
{
	constructor()
	{
		super('/register');
	}

	post(req, res)
	{
		const username = req.body.username;
		const password = req.body.password;

		const newUser = new User({ username, password });

		let success = false;

		const conn = Connection.getDefaultInstance();
		return bcrypt
			.hash(password, howManyTimes)
			.then(hash =>
			{
				newUser.password = hash;
				return conn.connect();
			})
			.then(db => Entity.save(db, newUser, { strictInsert: true }))
			.catch(err =>
			{
				if (err.code === Connection.DUPLICATE_KEY_ERROR)
				{
					throw e(409, 'This username is already taken!');
				}
				throw err;
			})
			.then(result => 
			{
				conn.close();
				if (result.writeError)
				{
					throw e(503); // db seems to be unavailable
				}
				if (result.result.n !== 1)
				{
					console.error(result);
					throw e(500);
				}
				return true;
			})
			.then(success =>
			{
				req.session.userUuid = newUser.uuid;
				req.session.username = newUser.username;
				return { success, user: newUser.toJSON() };
			})
		;
	}
}

module.exports = RegisterEndpoint;
