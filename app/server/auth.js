const url = require('url');

const restrictedPages = [
	/^\/profile.*$/,
	/^\/noties.*$/,
	/^\/api\/noties.*$/,
	/^\/api\/users.*$/,
	/^\/api\/logout.*$/,
	/^\/api\/share.*$/,
	/^\/api\/public.*$/
];

function authMiddleware(redirectUrl)
{
	return function authChecker(req, res, next)
	{
		const pathname = url.parse(req.url).pathname;
		for (let i in restrictedPages)
		{
			if (restrictedPages[i].test(pathname))
			{
				// restricted
				if (req.session.userUuid)
				{
					next();
					return;
				}
				else
				{
					// not authorized
					res.writeHead(303, { 'Location': redirectUrl });
					res.end();
					return;
				}
			}
		}
		// page is not restricted
		next();
	};
}

module.exports = authMiddleware;
