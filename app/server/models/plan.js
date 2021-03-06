const Entity = require('./entity');

const millisecondsPerDay = 1000*60*60*24;
const periods 	= ['week', 'month', '3 months', '6 months', 'year', '2 years'];
const plens		= [7,       30,       3*30,      6*30,       365,    2*365   ].map(days => days*millisecondsPerDay);

const NO_PERIOD = 255;

class Plan extends Entity
{
	constructor({
		plan_id,
		name,
		period,
		price,
		max_files_size,
		max_notes
	}) // this entity cannot be created from nothing, only deserialized
	{
		super();
		this.planId = plan_id;
		this.name = name;
		this.periodId = period;
		this.price = price;
		this.maxFilesSize = max_files_size;
		this.maxNotes = max_notes;
	}

	serialize()
	{
		const data = super.serialize();
		data.plan_id = this.planId;
		data.name = this.name;
		data.period = this.periodId;
		data.price = this.price;
		data.max_files_size = this.maxFilesSize;
		data.max_notes = this.maxNotes;
		return data;
	}

	toJSON()
	{
		const json = super.toJSON();
		json.period_name = this.period;
		return json;
	}

	getPK() { return 'plan_id'; }

	get period()
	{
		if (this.periodId != NO_PERIOD)
			return periods[this.periodId];
		else
			return 'infinite'
	}

	getDuration()
	{
		return plens[this.periodId];
	}
}
Plan.collection = 'plans';

Plan.FREE_PLAN_ID = 0;

Plan.PERIOD_WEEK		= periods[0];
Plan.PERIOD_MONTH		= periods[1];
Plan.PERIOD_3_MONTH		= periods[2];
Plan.PERIOD_6_MONTH		= periods[3];
Plan.PERIOD_YEAR		= periods[4];
Plan.PERIOD_2_YEARS		= periods[5];

Plan.extract = function (dbConnection, planId)
{
	return Entity.extract(dbConnection, Plan, { plan_id: planId });
}

module.exports = Plan;