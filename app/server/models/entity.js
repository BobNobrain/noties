/**
 * (abstract)
 * Class is a base for entity types that are stored in app database.
 * Every non-abstract subclass that can be stored in db should override
 * all methods and also have static field .collection, storing collection
 * name for this entity type.
 */
class Entity
{
	/**
	 * Constructor can be called in 2 ways:
	 * - without parameters: create a new entity that is not in database yet;
	 * - with data hash parameter: deserialize an entity from data in db format.
	 * Not every Entity subclass must be able to be constructed from nothing.
	 * Don't forget to call super(...) in subclasses constructors.
	 */
	constructor() {}
	/**
	 * Method serializes the entity into a hash before saving it to db.
	 * @return {Object} a hash of values in db format
	 */
	serialize() { return {}; }

	/**
	 * Method is used to write entity as json to HTTP response.
	 * @return {Object} An object representing this entity
	 */
	toJSON() { return this.serialize(); }

	/**
	 * Method obtains a primary key field name for this entity
	 * @return {string} a key (db field name)
	 */
	getPK() { throw new TypeError(`Entity::getPK() method is not overriden in ${this.constructor.name} class!`); }
}

/**
 * Method extracts an entity(-es) of a given type from db by given filter.
 * @param  {Db} An active connection to mongodb
 * @param  {Function} a non-abstract subclass of Entity, type of entity to extract
 * @param  {Object} a filter for searching in db
 * @param  {Number} max. entities to extract
 * @return {Promise<EntityClass>} extracted instance of EntityClass
 */
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
/**
 * Method return mapped mongo cursor object. It's next(), hasNext()
 * and toArray() are overriden to convert data from db directly into entities
 * @param  {Db} An active connection to mongodb
 * @param  {Function} a non-abstract subclass of Entity, type of entity to extract
 * @param  {Object} a filter for searching in db
 * @return {Cursor-like} mapped cursor
 */
Entity.extractAll = function (dbConnection, EntityClass, filter)
{
	const cursor = dbConnection.collection(EntityClass.collection).find(filter);
	return {
		next: () => cursor.next().then(data => new EntityClass(data)),
		hasNext: () => cursor.hasNext(),
		toArray: () => cursor.toArray().then(arr => arr.map(data => new EntityClass(data)))
	};
};

/**
 * Extracts object by given filters, one by one
 * @param  {Db} An active connection to mongodb
 * @param  {Function} A non-abstract subclass of Entity, type of entity to extract
 * @param  {Object[]} An array of db search filters
 * @return {Promise<EntityClass[]>} Promise for array of extracted entities
 */
Entity.extractSerial = function (dbConnection, EntityClass, filters)
{
	let p = Promise.resolve([]);
	for (let i = 0; i < filters.length; i++)
	{
		p = p.then(arr =>
		{
			arr.push(Entity.extract(dbConnection, Entity, filters[i]));
			return arr;
		});
	}
	return p;
}

/**
 * Saves given entity to db
 * @param  {Db} An active connection to mongodb
 * @param  {Entity} An entity to save
 * @return {Promise} result of update operation
 */
Entity.save = function (dbConnection, entity, { strictInsert = false, strictUpdate = false } = {})
{
	const data = entity.serialize();
	const key = data[entity.getPK()];
	const id = data[key];
	delete data[key];

	const collection = dbConnection.collection(entity.constructor.collection);
	if (strictInsert)
	{
		return collection.insertOne(data);
	}
	else
	{
		return collection.updateOne(
			{ [key]: id }, // filte
			{ $set: data }, // update operations
			{ upsert: !strictUpdate } // insert, on conflict update
		);
	}
};

module.exports = Entity;