const Entity = require('./entity');
const UuidEntity = require('./uuidentity');
const Noty = require('./noty');

class PublicNoty extends UuidEntity
{
	constructor({
		uuid,
		mode = 0,
		source
	} = {})
	{
		super({ uuid });
		this.modeId = mode;
		this.source = source;
	}

	serialize()
	{
		const data = super.serialize();
		data.mode = this.modeId;
		data.source = this.source;
		return data;
	}

	get mode()
	{
		return [
			PublicNoty.MODE_READ,
			PublicNoty.MODE_READWRITE
		][this.modeId];
	}

	extractSource(dbConnection) { return Entity.extract(dbConnection, Noty, { uuid: this.source }); }
}
PublicNoty.collection = 'public_noties';

PublicNoty.MODE_READ = { toString: _ => 'PublicNoty.MODE_READ' };
PublicNoty.MODE_READWRITE = { toString: _ => 'PublicNoty.MODE_READWRITE' };

module.exports = PublicNoty;
