module.exports = {
	ENV: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || 3000,
	URL: process.env.BASE_URL || 'http://localhost:3000',
	MONGODB_URI: process.env.MONGODB_URI || 'mongodb://user:db012345@ds159624.mlab.com:59624/db_windynov',
	JWT_SECRET: process.env.JWT_SECRET || 'MySecretISWere'
}