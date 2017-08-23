const config = require('./app/config.js');
const MongoClient = require('mongodb').MongoClient;
const uuid4 = require('uuid/v4');

const doGenerateData = process.argv[1] === '--gen-data';

const insertDocs = function(db, collection, docs, callback) {
  // Get the documents collection
  const dbCollection = db.collection(collection);
  // Insert some documents
  dbCollection.insertMany(docs, function(err, result) {
  	let ex = null;
  	if (err) ex = err;
  	if (result.result.n != docs.length)
  		ex = new Error('Managed to insert not all documents!');
  	callback(result);
  	throw ex;
  });
}

MongoClient.connect(url, function(err, db) {
	if (err)
	{
		console.error('could not enstablish connection to database: ' + err);
		return;
	}
	console.log("Connected successfully to server");

	if (doGenerateData)
	{

	}
	else
	{
		db.close();
	}
});

function generateUsers()
{
	const month = 1000 * 60 * 60 * 24 * 30;
	return new Array(5).map(() =>
	{
		const uuid = uuid4();
		return {
			uuid,
			username: 'user_' + uuid,
			password: 'secret',
			avatar: null,
			plan_id: 0,
			paid_until: new Date().valueOf() + month,
			black_list: []
		};
	});
}

function generateNoties(users)
{
	return users
		.map(u =>
		{
			return new Array(Math.floor(Math.random() * 10))
				.map(() =>
				{
					const uuid = uuid4();
					return {
						uuid,
						name: u.name + '_noty_' + uuid,
						content: uuid4(),
						files: []
					}
				})
			;
		})
		.reduce((acc, item) => acc.concat(item), [])
	;
}
