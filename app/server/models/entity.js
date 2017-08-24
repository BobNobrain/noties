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
 * Saves given entity to db
 * @param  {Db} An active connection to mongodb
 * @param  {Entity} An entity to save
 * @return {Promise} result of update operation
 */
Entity.save = function (dbConnection, entity)
{
	const data = entity.serialize();
	const key = data[entity.getPK()];
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