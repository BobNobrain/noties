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
	$('#register_form').on('submit', function (ev)
	{
		const login = $('#login_text').val();
		const passw = $('#passw_text').val();
		const passc = $('#passw_text_confirm').val();

		if (passw !== passc)
		{
			showError('Passwords mismatch!');
		}
		else
		{
			net.post('/api/register', { username: login, password: passw })
				.then(result =>
				{
					if (result.success)
						net.redirect('/noties');
					else
						throw result;
				})
				.catch(err =>
				{
					console.log(err);
					showError(err.error.error);
				})
			;
		}

		ev.preventDefault();
		return false;
	});
});
