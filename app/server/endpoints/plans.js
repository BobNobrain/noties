const e = require('http-errors');

const JsonEndpoint = require('../rest/jsonendpoint');
const Api = require('../rest/api');
const Connection = require('../mongo/connection.js');

const Entity = require('../models/entity');
const Plan = require('../models/plan');

class AllPlansEP extends JsonEndpoint
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
			.then(db => Entity.extractAll(db, Plan, {}).toArray())
			.then(plans => 
			{
				conn.close();
				return plans.map(plan => plan.toJSON())
			})
		;
	}
}

class OnePlanEP extends JsonEndpoint
{
	constructor()
	{
		super('/:id');
	}

	get(req, res)
	{
		const conn = Connection.getDefaultInstance();
		const plan_id = +req.params.id;
		return conn
			.connect()
			.then(db => Entity.extract(db, Plan, { plan_id }))
			.then(plans => 
			{
				conn.close();
				if (plans.length === 1)
					return plans[0].toJSON();
				else
					throw new e.NotFound(`No plan with plan_id=${plan_id} found`);
			})
		;
	}
}

class PlansEndpoint extends Api
{
	constructor()
	{
		super('/plans');
		this.addEndpoint(new AllPlansEP());
		this.addEndpoint(new OnePlanEP());
	}
}

module.exports = PlansEndpoint;
