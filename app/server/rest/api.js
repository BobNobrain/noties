const Page = require('./page');

function normalizeUrl(base, addition)
{
	if (base.endsWith('/')) base = base.substr(0);
	if (addition.startsWith('/'))
		return base + addition;
	else
		return base + '/' + addition;
}

class Api
{
	constructor(root)
	{
		this.root = root;
		this.endpoints = [];
	}

	addEndpoint(page)
	{
		if (page instanceof Page)
		{
			page.name = normalizeUrl(this.root, page.name);
			this.endpoints.push(page);
		}
		else
		{
			if (page != null)
				throw new TypeError(`Api::addEndpoint should be supplied with Page, but found ${page.constructor.name}`);
			else
				throw new TypeError('Api::addEndpoint supplied with invalid object')
		}
	}

	serve(app)
	{
		for (let i in this.endpoints)
		{
			this.endpoints[i].serve(app);
		}
	}
}

module.exports = Api;
