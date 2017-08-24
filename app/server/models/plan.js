const Entity = require('./entity');

const millisecondsPerDay = 1000*60*60*24;
const periods 	= ['week', 'month', '3 months', '6 months', 'year', '2 years'];
const plens		= [7,       30,       3*30,      6*30,       365,    2*365   ].map(days => days*millisecondsPerDay);

class Plan exdends Entity
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
		return {
			plan_id: this.planId,
			name: this.name,
			period: this.periodId,
			price: this.price,
			max_files_size: this.maxFilesSize,
			max_notes: this.maxNotes
		};
	}

	getPK() { return 'plan_id'; }

	get period()
	{
		return periods[this.periodId];
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