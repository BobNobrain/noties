require('./style.less');

const $ = require('jquery');
const net = require('../../client/net');

const showError = function (errmsg)
{
	const div = $('#error_msg');
	div.html(errmsg);
	div.removeClass('hidden');
};

$(() =>
{
	net.post('/api/logout', null)
		.then(result =>
		{
			if (result.success)
			{
				$('#success_msg').text('Successfully logged out, redirecting...')
				net.redirect('/');
			}
			else
				throw result;
		})
		.catch(err =>
		{
			console.log(err);
			showError(err.error.error);
		})
	;
});
