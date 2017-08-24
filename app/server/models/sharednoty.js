const Entity = require('./entity');
const UuidEntity = require('./uuidentity');
const User = require('./user');
const Noty = require('./noty');

class SharedNoty extends UuidEntity
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
		return data;
	}

	extractReaders(dbConnection) { return Entity.extractSerial(dbConnection, User, this.readers.map(uuid => ({ uuid }))); }
	extractWriters(dbConnection) { return Entity.extractSerial(dbConnection, User, this.writers.map(uuid => ({ uuid }))); }

	extractSource(dbConnection) { return Entity.extract(dbConnection, Noty, { uuid: this.source }); }

	share(user, canWrite)
	{
		if (canWrite)
			if (writers.indexOf(user) === -1)
				writers.push(user);
		if (readers.indexOf(user) === -1)
			readers.push(user);
	}
}
SharedNoty.collection = 'shared_noties';

module.exports = SharedNoty;
