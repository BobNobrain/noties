const Entity = require('./entity');
const uuidv4 = require('uuid/v4');

class UuidEntity extends Entity
{
	constructor({ uuid = uuidv4() } = {})
	{
		super();
		this.uuid = uuid;
	}

	serialize()
	{
		const data = super.serialize();
		data.uuid = this.uuid;
		return data;
	}

	getPK() { return 'uuid'; }
}

module.exports = UuidEntity;