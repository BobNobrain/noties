const Page = require('./page');

class JsonEndpoint extends Page
{
	constructor(name)
	{
		super(name);
	}

	invoke(method, req, res)
	{
		new Promise(method(req, res))
			.then(result =>
			{
				res.json(result);
			})
			.catch(err =>
			{
				this.error(err, req, res);
			})
		;
	}
}

module.exports = JsonEndpoint;
