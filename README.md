# Angular Universal - techniques

This application is part of the Guide to the Angular Universal course available on newline.co

# Prerequisites

To make this applicatin up and running you need to install the followings on your local machine:

- [GIT](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js & NPM](https://nodejs.org/en/)
- [Redis server](https://redis.io)


To accomplish tasks during the workshop you need:

- [Angular CLI](https://angular.io/cli)
- [Postman](https://www.postman.com)



Apart of that you need to have a [Free MongoDB Cloud account](https://cloud.mongodb.com/user)


## MongoDB setup

Once you're done with installation of the prerequisites you need to set up MongoDB and adjust your project.

1. Navigate to (https://cloud.mongodb.com/user)[https://cloud.mongodb.com/user] and sign in to your account
1. Create a new clustiner in region that is closes to you: ![img](https://raw.githubusercontent.com/maciejtreder/angular-uvniersal-training/master/atlas2.jpg)

1. When your cluster is ready, click the Connect button and follow the prompts in the Connect to Cluster panel to:

    1. Allow access from anywhere
    1. Create a MongoDB user: ![img](https://raw.githubusercontent.com/maciejtreder/angular-uvniersal-training/master/atlas3.jpg)
    1. In the Choose a connection method step, select Connect with the Mongo Shell. Follow directions for downloading, installing, and configuring the MongoDB Shell to run on your system.
    1. When you've configured the MongoDB Shell to run on your system, copy the supplied command-line instructions to a safe place.

1. If you haven't done it yet - clone this repository
1. Feed database with data with the following two commands:
```
mongoimport --uri mongodb+srv://<username>:<password>@<hostname>/<database_name> \
--collection products --file db/products.json
```

```
mongoimport --uri mongodb+srv://<username>:<password>@<hostname>/<database_name> \
--collection users --file db/users.json
```

## Connect application with MongoDB
Edit the `api.ts` file to point to your MongoDB:

```
const dbUrl =
  'mongodb+srv://<username>:<password>@cluster0.1gerr.mongodb.net/cluster0';
const dbClient = MongoClient.connect(dbUrl, {
  useUnifiedTopology: true,
}).then((connection) => connection.db('cluster0'));
```

## Final check

At the very end, try to install, build and start the application:

```
npm install
npm run build
npm start
```

After navigating to the localhost:8080 you should see an Angular Application up and running.