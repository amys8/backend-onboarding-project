import { connect } from 'http2';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { Item } from './models/Item';
import { Order } from './models/Order';
import { User } from './models/User';

export const createItem = async (conn: Connection, name: string, description: string, price: number) => {
  const item = new Item();
  item.name = name;
  item.description = description;
  item.price = price;
  const createdItem = await conn.manager.save(item);
  return createdItem.uuid;
};

export const deleteItem = async (conn: Connection, uuid: string) => {
  const status = await conn.manager.delete(Item, { uuid: uuid });
  return status;
};

export const createOrder = async (conn: Connection, itemId: string, userId: string) => {
  const order = new Order();
  order.itemId = itemId;
  order.userId = userId;
  const createdOrder = await conn.manager.save(order);
  return createdOrder;
};

export const createUser = async (conn: Connection, username: string, password: string) => {
  const user = new User();
  user.username = username;
  user.password = password;
  const createdUser = await conn.manager.save(user);
  return createdUser.uuid;
};

export const loginUser = async (conn: Connection, username: string, password: string) => {
  const user = await conn.manager.findOne(User, { username: username, password: password });
  return user.uuid;
};

export const getItems = async (conn: Connection) => {
  const items = await conn.manager.find(Item);
  return items;
};

export const getUserOrders = async (conn: Connection, userId: string) => {
  const results = [];
  const orders = await conn.manager.find(Order, { where: { userId: userId } });
  for (const order of orders) {
    const item = await conn.manager.findOne(Item, { where: { uuid: order.itemId } });
    const result = [order.uuid, order.createdAt, [item.name, item.price]];
    results.push(result);
  }
  return results;
};

export const getOrders = async (conn: Connection, userId: string, itemId: string) => {
  const order = await conn.manager.findOne(Order, { where: { userId: userId, itemId: itemId } });
  const item = await conn.manager.findOne(Item, { where: { uuid: itemId } });
  return [order.uuid, order.createdAt, item.name, item.price];
};

export const getUsers = async (conn: Connection) => {
  const users = await conn.manager.find(User, { select: ["uuid", "username"] });
  return users;
};

export const getUser = async (conn: Connection, uuid: string) => {
  const user = await conn.manager.findOne(User, { where: { uuid: uuid } });
  const orders = await conn.manager.find(Order, { where: { userId: uuid } });
  const result = [user.uuid, user.username, orders];
  return result;
}