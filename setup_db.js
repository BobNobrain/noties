const config = require('./app/config.js');
const MongoClient = require('mongodb').MongoClient;
const uuid4 = require('uuid/v4');
const fs = require('fs');

const doGenerateData = process.argv.indexOf('--gen-data') != -1;
const doSaveJson = process.argv.indexOf('--save') != -1;
const doCreateTables = process.argv.indexOf('--again') == -1;

let db = null;
let data = null;

MongoClient.connect(config.mongoUrl).then(conn =>
{
	console.log("Connected successfully to server");
	db = conn;

	if (doGenerateData)
	{
		data = generateFakeData();
		console.log('Generation done:');
		for (let key in data)
		{
			if (!data.hasOwnProperty(key)) continue;
			console.log(`- ${key}: ${data[key].length} items;`);
		}
		if (doSaveJson)
		{
			console.log('Saving to file: generated_data.json...');
			fs.writeFile(
				'generated_data.json',
				JSON.stringify(data),
				function(err) {
					if(err)
					{
						return console.log(err);
					}
					console.log('Done.');
				}
			);
		}
	}
	return db;
})
	// creating collections and indexes
	.then(_ =>
	{
		if (doCreateTables)
		{
			return Promise.resolve(void 0)
				.then(_ => db.createCollection('users'))
				.then(_ => db.createIndex('users', { uuid: 1 }, { unique: true }))
				.then(_ => db.createIndex('users', { username: 1 }, { unique: true }))
				
				.then(_ => db.createCollection('noties'))
				.then(_ => db.createIndex('noties', { uuid: 1 }, { unique: true }))
				.then(_ => db.createIndex('noties', { name: 1 }, { unique: false }))

				.then(_ => db.createCollection('files'))
				.then(_ => db.createIndex('files', { uuid: 1 }, { unique: true }))
				.then(_ => db.createIndex('files', { owner: 1 }, { unique: false }))

				.then(_ => db.createCollection('plans'))
				.then(_ => db.createIndex('plans', { plan_id: 1 }, { unique: true }))

				.then(_ => db.createCollection('shared_noties'))
				.then(_ => db.createIndex('shared_noties', { uuid: 1 }, { unique: true }))

				.then(_ => db.createCollection('public_noties'))
				.then(_ => db.createIndex('public_noties', { uuid: 1 }, { unique: true }))

				.then(_ => db.createCollection('friends'))
				.then(_ => db.createIndex('friends', { from: 1 }, { unique: false }))
				.then(_ => db.createIndex('friends', { to: 1 }, { unique: false }))
			;
		}
	})

	// filling it with data
	.then(_ =>
	{
		if (data === null)
		{
			// no data was generated
			return;
		}
		return Promise.resolve(void 0)
			// cleanup data if exists
			.then(_ => db.collection('plans').deleteMany({}))
			.then(_ => db.collection('users').deleteMany({}))
			.then(_ => db.collection('friends').deleteMany({}))
			.then(_ => db.collection('files').deleteMany({}))
			.then(_ => db.collection('noties').deleteMany({}))
			.then(_ => db.collection('shared_noties').deleteMany({}))
			.then(_ => db.collection('public_noties').deleteMany({}))
			// insert newly generated data
			.then(_ => db.collection('plans').insertMany(data.plans))
			.then(_ => db.collection('users').insertMany(data.users))
			.then(_ => db.collection('friends').insertMany(data.friends))
			.then(_ => db.collection('files').insertMany(data.files))
			.then(_ => db.collection('noties').insertMany(data.noties))
			.then(_ => db.collection('shared_noties').insertMany(data.sharedNoties))
			.then(_ => db.collection('public_noties').insertMany(data.publicNoties))
			.then(_ => console.log('Inserted new values successfully!'))
		;
	})

	.then(_ => db.close())
	.catch(err => console.error(err) || db.close())
;

function generateFakeData(scales = 1)
{
	let users = [],
		noties = [],
		files = [],
		plans = [],
		sharedNoties = [],
		publicNoties = [],
		friends = [];
	const month = 1000 * 60 * 60 * 24 * 30;
	const rnd = n => Math.floor(Math.random()*n);
	const randomElement = arr => arr[rnd(arr.length)];
	const randomFilter = (arr, prob) => arr.filter(() => Math.random() < prob);
	const arr = n => { const a=[]; for (let i = 0; i < n; i++) a.push(void 0); return a; };

	// the generation itself
	generatePlans();
	const usersCount = Math.floor(5 * scales);
	for (let i = 0; i < usersCount; i++)
	{
		users.push(generateUser());
	}
	users.forEach(generateBlackList);

	const maxNotiesCountPerUser = Math.floor(20 * scales);
	users.forEach(user =>
	{
		let notiesCount = rnd(maxNotiesCountPerUser + 1);
		for (let i = 0; i < notiesCount; i++)
		{
			noties.push(generateNoty(user));
		}
	});

	randomFilter(noties, 0.3).forEach(n => sharedNoties.push(generateShared(n)));
	randomFilter(noties, 0.2).forEach(n => publicNoties.push(generatePublic(n)));

	while (!friends.length)
	{
		randomFilter(users, 0.9).forEach(user =>
		{
			randomFilter(users, 0.05)
				.filter(u => u.uuid != user.uuid)
				.forEach(u => friends.push(generateFriendship(user, u)));
		});

		cleanupFriends();
	}

	function generateUser()
	{
		const uuid = uuid4();
		return {
			uuid,
			username: 'user_' + uuid.substr(0, 7),
			password: 'secret',
			avatar: null,
			plan_id: randomElement(plans).plan_id,
			paid_until: new Date().valueOf() + month,
			black_list: []
		};
	}

	function generateBlackList(user)
	{
		user.black_list = randomFilter(users, 0.05)
			.map(u => u.uuid)
			.filter(uuid => uuid != user.uuid);
	}

	function generateNoty(user)
	{
		const uuid = uuid4();
		const content = generateFile(user);
		files.push(content);
		const attachments = arr(Math.floor(Math.random()*Math.random()*4 * scales))
			.map(() => generateFile(user, 'image/png'))
		;
		attachments.forEach(a => files.push(a));
		return {
			uuid,
			name: user.username + '_noty_' + uuid,
			content: content.uuid,
			files: attachments.map(f => f.uuid)
		};
	}

	function generateFile(user, type = 'text/plain')
	{
		return {
			uuid: uuid4(),
			owner: user.uuid,
			type,
			size: rnd(1024)
		};
	}

	function generatePublic(noty)
	{
		return {
			uuid: uuid4(),
			mode: rnd(2), // 0=r, 1=w
			source: noty.uuid
		};
	}
	function generateShared(noty)
	{
		const readers = randomFilter(users, 0.1).map(u => u.uuid);
		return {
			uuid: uuid4(),
			readers,
			writers: randomFilter(readers, 0.5),
			source: noty.uuid
		};
	}

	function generateFriendship(from, to)
	{
		return {
			from: from.uuid,
			to: to.uuid,
			accepted: !!rnd(3) // 33% false / 66% true
		};
	}

	function generatePlans()
	{
		const periods = ['month', '6 months', 'year'];
		const options = ['Basic', 'Professional', 'Maximal'];
		let id = 1;
		plans.push({
			plan_id: 0,
			name: 'Free',
			period: 255, // infinite
			price: 0,
			max_files_size: 100 * 1024,
			max_notes: 25
		});
		for (let p = 0; p < periods.length; p++)
		{
			for (let o = 0; o < options.length; o++)
			{
				let period = periods[p], option = options[o];
				plans.push({
					plan_id: id,
					name: `${option} for ${period}`,
					period: ['week', 'month', '6 months', 'year'].indexOf(period),
					price: (o+1) * (1 + p / 100) * 100,
					max_files_size: (o+1) * 1024 * 1024,
					max_notes: 100 * (o+1)
				});
				++id;
			}
		}
	}

	function cleanupFriends()
	{
		for (let i = 0; i < friends.length; i++)
		{
			let friendship = friends[i];
			for (let j = i + 1; j < friends.length; j++)
			{
				if (friendship.from === friends[j].to &&
					friendship.to === friends[j].from)
				{
					// removing 'duplicate' records
					friends.splice(j, 1);
					--j;
				}
			}
		}
	}

	return { users, noties, plans, files, sharedNoties, publicNoties, friends };
}
