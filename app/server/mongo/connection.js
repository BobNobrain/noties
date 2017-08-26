const MongoClient = require('mongodb').MongoClient;
const config = require('../../config.js');

class Connection
{
	constructor({ mongoUrl })
	{
		this.mongoUrl = mongoUrl;
		this.db = null;
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

	close()
	{
		this.db.close();
	}
}

Connection.getDefaultInstance = function ()
{
	return new Connection(config);
};

Connection.DUPLICATE_KEY_ERROR = 11000;

module.exports = Connection;
