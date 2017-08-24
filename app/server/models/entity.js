class Entity
{
	constructor() {}
	serialize() { return {}; }
}

Entity.extract = function (dbConnection, EntityClass, filter, limit = 1)
{
	return dbConnection
		.collection(EntityClass.collection)
		.find(filter)
		.limit(limit)
		.toArray()
		.then(array => array.map(data => new EntityClass(data)))
	;
};
Entity.extractAll = function (dbConnection, EntityClass, filter)
{
	const cursor = dbConnection.collection(EntityClass.collection).find(filter);
	return {
		next: () => cursor.next().then(data => new EntityClass(data)),
		hasNext: () => cursor.hasNext(),
		toArray: () => cursor.toArray().then(arr => arr.map(data => new EntityClass(data)))
	};
};
Entity.save = function (dbConnection, entity)
{
	const data = entity.serialize();
	const key = data[entity.constructor.PK];
	const id = data[key];
	delete data[key];
	return dbConnection
		.collection(entity.constructor.collection)
		.updateOne(
			{ [key]: id }, // filte
			r
			{ $set: data }, // update operations
			{ upsert: true } // insert, on conflict update
		)
	;
};

module.exports = Entity;