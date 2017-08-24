const Entity = require('./entity');
const UuidEntity = require('./uuidentity');
const Plan = require('./plan');

class User extends UuidEntity
{
	constructor({
		uuid,
		username,
		password,
		avatar = null,
		plan_id = Plan.FREE_PLAN_ID,
		paid_until = 0,
		black_list = []
	} = {})
	{
		super({ uuid });
		this.username = username;
		this.password = password;
		this.avatar = avatar;
		this.planId = plan_id;
		this.paidUntil = new Date(paid_until);
		this.blackList = black_list;

		this.plan = null;
	}

	serialize()
	{
		return {
			username: this.username,
			password: this.password,
			avatar: this.avatar,
			plan_id: this.planId,
			paid_until: this.paidUntil,
			black_list: this.blackList
		};
	}

	extractBlackList(dbConnection)
	{
		let p = Promise.resolve([]);
		for (let i = 0; i < this.blackList.length; i++)
		{
			p = p.then(arr =>
			{
				arr.push(Entity.extract(dbConnection, User, { uuid: this.blackList[i] }));
				return arr;
			});
		}
		return p;
	}

	extractPlan(dbConnection)
	{
		return Plan.extract(this.planId)
			.then(plan =>
				{
					this.plan = plan;
					return plan;
				});
	}

	getTimeToPayDay()
	{
		if (this.planId != Plan.FREE_PLAN_ID)
			return this.paidUntil - Date.now();
		else
			return +Infinity;
	}

	paid(payTime)
	{
		return this.extractPlan().then(plan =>
		{
			this.paidUntil = payTime + plan.getDuration();
		});
	}
}
User.collection = 'users';

module.exports = User;
