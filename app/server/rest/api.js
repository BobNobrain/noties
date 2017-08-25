const Page = require('./page');

class Api extends Page
{
	constructor(root)
	{
		super(root);
		this.endpoints = [];
	}

	addEndpoint(page)
	{
		if (page instanceof Page)
		{
			this.endpoints.push(page);
			page.parent = this;
		}
		else
		{
			if (page != null)
				throw new TypeError(`Api::addEndpoint should be supplied with Page, but found ${page.constructor.name}`);
			else
				throw new TypeError('Api::addEndpoint supplied with invalid object');
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
