const e = require('http-errors');

const methods = [ 'get', 'post', 'put', 'delete', 'all' ];

class Page
{
	constructor(name)
	{
		this.name = name;
	}

	serve(app)
	{
		for (let i in methods)
		{
			const method = methods[i];
			if (typeof this[method] === typeof eval)
			{
				app[method.toLowerCase()](this.name, (req, res, next) =>
				{
					try
					{
						this.invoke(this[method].bind(this), req, res);
					}
					catch (err)
					{
						this.error(err, req, res);
					}
				});
			}
		}
	}

	invoke(method, req, res)
	{
		method(req, res);
	}

	error(err, req, res)
	{
		console.error(err);
		
		if (!(err instanceof e.HttpError))
			err = e(500, 'Internal Server Error')
		res.status(err.status);
		res.json({ error: err.message });
	}
}

module.exports = Page;
