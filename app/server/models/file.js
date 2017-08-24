const UuidEntity = require('./uuidentity');
const path = require('path');

class File extends UuidEntity
{
	constructor({
		uuid,
		size = 0,
		owner = null,
		type = 'text/plain'
	} = {})
	{
		super({ uuid });
		this.size = size;
		this.owner = owner;
		this.type = type;
	}

	serialize()
	{
		const data = super.serialize();
		data.size = this.size;
		data.owner = this.owner;
		data.type = this.type;
		return data;
	}

	getFileNameArr()
	{
		return path.join(uuid.substr(0, 2), uuid.substr(2,2), uuid);
	}
}
File.collection = 'files';

module.exports = File;
