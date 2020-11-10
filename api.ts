import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { ObjectId, MongoClient } from 'mongodb';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { join } from 'path';

export const api = express.Router();

api.use(
  cors({
    origin: true,
    credentials: true,
  })
);
api.use(bodyParser.json());
api.use(cookieParser());

const dbUrl =
  'mongodb+srv://<username>:<password>@cluster0.1gerr.mongodb.net/cluster0';
const dbClient = MongoClient.connect(dbUrl, {
  useUnifiedTopology: true,
}).then((connection) => connection.db('cluster0'));

dbClient.then(() => {
  console.log('Connected to the database.');
});

async function retrieveFromDb(
  collectionName,
  project = {},
  query = {}
): Promise<any[]> {
  project['_id'] = 0;
  const db = await dbClient;
  return new Promise((resolve) => {
    db.collection(collectionName)
      .aggregate([
        { $match: query },
        {
          $addFields: {
            id: { $toString: '$_id' },
          },
        },
        { $project: project },
      ])
      .toArray((err, objects) => {
        resolve(objects);
      });
  });
}

api.get('/products', async (req, res) => {
  console.log('GET products');
  const products = await retrieveFromDb('products', {
    description: 0,
  });
  res.send(products);
});

api.get('/products/:id', async (req, res) => {
  const products = await retrieveFromDb(
    'products',
    {},
    { _id: ObjectId(req.params.id) }
  );

  if (products.length == 0) {
    res.sendStatus(404);
  } else {
    res.send(products[0]);
  }
});

const key = fs.readFileSync(join(process.cwd(), 'privkey.pem'), 'utf8');

function encrypt(toEncrypt: string): string {
  const buffer = Buffer.from(toEncrypt);
  const encrypted = crypto.privateEncrypt(key, buffer);
  return encrypted.toString('base64');
}

function decrypt(toDecrypt: string): string {
  const buffer = Buffer.from(toDecrypt, 'base64');
  const decrypted = crypto.publicDecrypt(key, buffer);
  return decrypted.toString('utf8');
}

const hash = crypto.createHash('sha512');
api.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = hash.update(req.body.password).digest('hex');
  const foundUsers = await retrieveFromDb(
    'users',
    { password: 0 },
    { email: email, password: password }
  );

  if (foundUsers.length == 0) {
    res.sendStatus(401);
  } else {
    const user = foundUsers[0];
    res.cookie('loggedIn', encrypt(`${user.id}`), {
      maxAge: 600 * 1000,
      httpOnly: true,
    });

    delete user.id;
    res.send(user);
  }
});

api.get('/isLoggedIn', async (req, res) => {
  if (req.cookies.loggedIn) {
    const userId = decrypt(req.cookies.loggedIn);
    const foundUsers = await retrieveFromDb(
      'users',
      { _id: 0, password: 0 },
      { _id: ObjectId(userId) }
    );

    const user = foundUsers[0];
    delete user.id;
    res.send(user);
  } else {
    res.sendStatus(401);
  }
});

api.post('/favorites/:id', async (req, res) => {
  const userId = decrypt(req.cookies.loggedIn);

  const newFavorite = req.params.id;

  const user = await retrieveFromDb(
    'users',
    { _id: 0, password: 0 },
    { _id: ObjectId(userId) }
  );
  const currentFavorites = user[0].favorite;

  if (!currentFavorites.includes(newFavorite)) {
    currentFavorites.push(newFavorite);
    await (await dbClient)
      .collection('users')
      .updateOne(
        { _id: ObjectId(userId) },
        { $set: { favorite: currentFavorites } }
      );
    res.status(202);
  }
  res.send(user[0]);
});
