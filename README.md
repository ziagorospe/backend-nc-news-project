# Northcoders News API

you will need to create .env.development (PGDATABASE=nc_news) and .env.test (PGDATABASE=nc_news_test) files for this to run.

The database is host:
DatabaseURL: postgres://zjsifane:ii2TFSXr1arEXu6VSOh-lJODSNnJTTC4@trumpet.db.elephantsql.com/zjsifane

The api request handler host:
Web Host: https://backend-nc-news-project.onrender.com

About:
This project is an api simulation to handle articles and comments about web posts.

You will need to run the commands below to get started
Cloning:
git clone https://github.com/ziagorospe/backend-nc-news-project.git

Installing dependencies:
npm install

Seeding the databases:
npm run setup-dbs
npm run seed
//the test file will seed the test data when ran
npm test app

Minimum requirements:
node: 10.13.0
postgres: 8.7.3
