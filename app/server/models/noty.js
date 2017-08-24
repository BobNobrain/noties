const UuidEntity = require('./uuidentity');
const User = require('./user');
const File = require('./user');

class Noty extends UuidEntity
{
	constructor({
		uuid,
		name = 'A Noty',
		owner = null,
		content = null,
		files = []
	} = {})
	{
		super({ uuid });
		this.name = name;
		this.owner = owner;
		this.content = content;
		this.files = files;
	}

	serialize()
	{
		const data = super.serialize();
		data.name = this.name;
		data.owner = this.owner;
		data.content = this.content;
		data.files = this.files;
		return data;
	}

	extractFiles(dbConnection)
	{
		return Entity.extractSerial(dbConnection, File, this.files.map(uuid => ({ uuid })));
	}

	extractOwner(dbConnection)
	{
		return Entity.extract(dbConnection, User, { uuid: this.owner });
	}
}
Noty.collection = 'noties';

Noty.extract = function (dbConnection, uuid)
{
	return Entity.extract(dbConnection, Noty, { uuid });
}

module.exports = Noty;
