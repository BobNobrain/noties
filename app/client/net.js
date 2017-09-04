const Q = require('q');

const MIME_JSON = 'application/json';

const net = {
	request(method, url, body, isJson = true)
	{
		const defer = Q.defer();
		const req = new XMLHttpRequest();
		req.open(method, url, true);
		if (isJson)
			req.setRequestHeader('Content-Type', MIME_JSON);
		req.send(body);

		req.onreadystatechange = function ()
		{
			if (req.readyState != 4) return;
			
			const responseType = req.getResponseHeader('Content-Type');
			let responseBody = null;
			if (responseType.startsWith(MIME_JSON))
			{
				responseBody = JSON.parse(req.responseText);
			}
			else
			{
				responseBody = req.responseText;
			}

			if (req.status >= 200 && req.status < 300)
			{
			}
			else
			{
				defer.reject({ code: req.status, error: responseBody });
			}
		}
		return defer.promise;
	},

	get: function(url, params)
	{
		const query = '?' + Object
			.keys(params)
			.map(pname => `${escape(pname)}=${escape(params[pname])}`)
			.join('&')
		;
		return this.request('GET', url + query, null, false);
	},

	post(url, params)
	{
		return this.request('POST', url, JSON.stringify(params), true);
	},

	delete(url)
	{
		return this.request('DELETE', url, null, false);
	},

	redirect(url)
	{
		document.location = url;
	}
};

module.exports = net;
