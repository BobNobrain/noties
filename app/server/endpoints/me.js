const e = require('http-errors');

const JsonEndpoint = require('../rest/jsonendpoint');
// const Api = require('../rest/api');
const Connection = require('../mongo/connection.js');

const Entity = require('../models/entity');
const User = require('../models/user');

class MeEndpoint extends JsonEndpoint
{
	constructor()
	{
		super('/me');
	}

	get(req, res)
	{
		const uuid = req.session.userUuid;
		if (uuid)
		{
			const conn = Connection.getDefaultInstance();
			return conn
				.connect()
				.then(db => Entity.extract(db, User, { uuid }))
				.then(users => 
				{
					conn.close();
					if (users.length === 1)
					{
						return users[0].toJSON();
					}
					else
					{
						throw e(400, 'Corrupt session detected!');
					}
				})
			;
		}
		else
		{
			return null;
		}
	}

	post(req, res)
	{
		// post request updates info about user
		// TODO
		throw new e.NotImplemented();
	}
}

module.exports = MeEndpoint;
