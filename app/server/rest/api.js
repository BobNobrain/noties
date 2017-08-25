const Page = require('./page');

class Api extends Page
{
	constructor(root)
	{
		super(root);
		this.endpoints = [];
	}

	// setName(val)
	// {
	// 	super.setName(val);
	// 	if (this.endpoints)
	// 	{
	// 		for (let i = 0; i < this.endpoints.length; i++)
	// 		{
	// 			const ep = this.endpoints[i];
	// 			ep.setName(normalizeUrl(val, ep.getName()));
	// 		}
	// 	}
	// }

	addEndpoint(page)
	{
		if (page instanceof Page)
		{
			// page.setName(normalizeUrl(this.getName(), page.getName()));
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
