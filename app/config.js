if (!process.env.DB_IP)
	console.warn('config.js: env variable DB_IP is not set!');

module.exports = {
	NODE_ENV: process.env.NODE_ENV || 'dev',

	staticFolder: 'public',
	port: 1337,
	mongoUrl: `mongodb://${process.env.DB_IP}:27017/noties`,

	cookieSecret: 'coookies!!! omnomnomnom',
	loginPage: '/login'
};
