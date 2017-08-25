const e = require('http-errors');

const JsonEndpoint = require('../rest/jsonendpoint');
const Api = require('../rest/api');
const Connection = require('../mongo/connection.js');

const Entity = require('../models/entity');
const Noty = require('../models/noty');

class ListNotiesEP extends JsonEndpoint
{
	constructor()
	{
		super('');
	}

	get(req, res)
	{
		const conn = Connection.getDefaultInstance();
		return conn
			.connect()
			// TODO: obtain user uuid from request!
			.then(db => Entity.extractAll(db, Noty, { owner: '1660cca0-6601-4e3c-8f42-7af0dd875dab' }).toArray())
			.then(noties => 
			{
				conn.close();
				return noties.map(noty => noty.toJSON())
			})
		;
	}

	post(req, res)
	{
		return { success: false, reason: 'Not implemented' };
		const conn = Connection.getDefaultInstance();
		return conn
			.connect()
			// TODO: obtain user uuid from request!
			.then(db => Entity.extractAll(db, Noty, { owner: '296b2724-8405-41a5-a50c-9b72d30ffdc7' }).toArray())
			.then(noties => 
			{
				conn.close();
				return noties.map(noty => noty.toJSON())
			})
		;
	}
}

class NotiesEndpoint extends Api
{
	constructor()
	{
		super('/noties');
		this.addEndpoint(new ListNotiesEP());
	}
}

module.exports = NotiesEndpoint;
