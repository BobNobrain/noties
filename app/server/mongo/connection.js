const MongoClient = require('mongodb').MongoClient;
const config = require('../../config.js');

class Connection
{
	constructor({ mongoUrl })
	{
		this.mongoUrl = mongoUrl;
		this.db = null;
		this.error = null;
	}

	connect()
	{
		return MongoClient.connect(this.mongoUrl)
			.then(conn =>
			{
				this.db = conn;
				return conn;
			})
		;
	}

	registerError(err)
	{
		this.error = err;
	}
	get isError() { return this.error !== null; }
}

Connection.getInstance = function ()
{
	if (!Connection._instance)
		Connection._instance = new Connection(config);
	return Connection._instance;
};

module.exports = Connection;
