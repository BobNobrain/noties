const UuidEntity = require('./uuidentity');
const User = require('./user');
const Noty = require('./noty');

class SharedNoty
{
	constructor({
		uuid,
		readers = [],
		writers = [],
		source
	} = {})
	{
		super({ uuid });
		this.readers = readers;
		this.writers = writers;
		this.source = source;
	}

	serialize()
	{
		const data = super.serialize();
		data.readers = this.readers;
		data.writers = this.writers;
		data.source = this.source;
	}
}
SharedNoty.collection = 'shared_noties';

module.exports = SharedNoty;
