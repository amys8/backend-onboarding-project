import { Router, Request, Response } from "express";
import path from "path";
import { createItem, deleteItem, createOrder, createUser, loginUser, getItems, getUserOrders, getOrders, getUsers, getUser } from "./service";

export const router = Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// We're disabling bearer-based authentication for this example since it'll make it tricky to test with pure html
// sending bearer tokens in your requests is *far* easier using frameworks like axios or fetch
// const authorizedUsers = ["ronak"]; // not really how auth works, but this is a simple example
// 
// router.use("/admin", (req, res, next) => {
//   const bearerHeader = req.headers['authorization'];

//   if (bearerHeader) {
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];
//     if (authorizedUsers.includes(bearerToken)) {
//       return next();
//     }
//   }
//   return res.status(401).send("Unauthorized");
// });

// handle all POST requests that match '/'

// create item
router.post('/item', async (req: Request, res: Response) => {
  if (!('name' in req.body) || !('price' in req.body) || !('description' in req.body)) {
    res.status(400).send('Missing required variables!');
  }
  const name = req.body.name as string;
  const description = req.body.description as string;
  const price = Number(req.body.price);
  if (name.length < 0 || name.length > 26 || isNaN(price)) {
    return res.status(400).send('Invalid argument shape!');
  }
  const uuid = await createItem(req.dbConnection, name, description, price);
  return res.send({
    uuid
  });
});

// delete item
router.delete('/items/:uuid', async (req: Request, res: Response) => {
  const uuid = req.params.uuid as string;
  const status = await deleteItem(req.dbConnection, uuid);
  return res.send({
    status
  });
});

// place order
router.post('/order', async (req: Request, res: Response) => {
  if (!('itemId' in req.body) || !('userId' in req.body)) {
    res.status(400).send('Missing required variables!');
  }
  const itemId = req.body.itemId as string;
  const userId = req.body.userId as string;
  const uuid = await createOrder(req.dbConnection, itemId, userId);
  return res.send({
    uuid
  });
});

router.post('/user', async (req: Request, res: Response) => {
  if (!('username' in req.body) || !('password' in req.body)) {
    res.status(400).send('Missing required variables!');
  }
  const username = req.body.username as string;
  const password = req.body.password as string;
  const uuid = await createUser(req.dbConnection, username, password);
  return res.send({
    uuid
  });
});

router.post('/login', async (req: Request, res: Response) => {
  if (!('username' in req.body) || !('password' in req.body)) {
    res.status(400).send('Missing required variables!');
  }
  const username = req.body.username as string;
  const password = req.body.password as string;
  const uuid = await loginUser(req.dbConnection, username, password);
  return res.send({
    uuid
  });
});

// get items
router.get('/items', async (req: Request, res: Response) => {
  const items = await getItems(req.dbConnection);
  return res.send(
    items
  );
});

router.get('/orders?userId=', async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const orders = await getUserOrders(req.dbConnection, userId);
  return res.send(
    orders
  );
});

router.get('/orders/:uuid', async (req: Request, res: Response) => {
  const userId = req.body.user as string;
  const itemId = req.params.uuid as string;
  const order = await getOrders(req.dbConnection, userId, itemId);
  return res.send({
    order
  });
});

router.get('/users', async (req: Request, res: Response) => {
  const users = await getUsers(req.dbConnection);
  return res.send(
    users
  );
});

router.get('/user/:uuid', async (req: Request, res: Response) => {
  const uuid = req.params.uuid;
  const info = getUser(req.dbConnection, uuid);
  return res.send(
    info
  );
});
