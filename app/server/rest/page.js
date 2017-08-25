const e = require('http-errors');

const methods = [ 'get', 'post', 'put', 'delete', 'all' ];

function normalizeUrl(base, addition)
{
	console.log(`normalize url: (${base}, ${addition})`);
	if (base.endsWith('/')) base = base.substr(0);
	if (addition.startsWith('/'))
		return base + addition;
	else
		return base + '/' + addition;
}

class Page
{
	constructor(name)
	{
		this.setName(name);
		this.parent = null;
	}

	getName()
	{
		if (this.parent)
			return normalizeUrl(this.parent.getName(), this.name);
		return this.name;
	}
	setName(val) { this.name = val; }

	serve(app)
	{
		for (let i in methods)
		{
			const method = methods[i];
			if (typeof this[method] === typeof eval)
			{
				app[method](this.getName(), (req, res, next) =>
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
Page.normalizeUrl = normalizeUrl;

module.exports = Page;
