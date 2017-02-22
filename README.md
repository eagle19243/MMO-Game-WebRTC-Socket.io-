# MMO
## Local start
`npm install`  
`npm run start`  

Need local environments for work
```
IP='127.0.0.1' // required
PORT='4000' // required
SECRET='' // required - any symbols(numbers, letters)
DOMAIN='' // required - can be IP
REDIS='' // required
MYSQL='' // required
MYSQL_LOGIN='' 
MYSQL_PASS=''
MYSQL_DBNAME=''
TWITTER_CONSUMER_KEY='' // can be empty
TWITTER_CONSUMER_KEY_SECRET='' // can be empty
FACEBOOK_APP_ID='' // can be empty
FACEBOOK_APP_SECRET='' // can be empty
GOOGLE_CLIENT_ID='' // can be empty
GOOGLE_CLIENT_SECRET='' // can be empty
```

## Deploy to server
`git commit` // commit changes to github  
`cap deploy:update` // deploy to server
