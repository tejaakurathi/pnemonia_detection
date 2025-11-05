// src/models/User.js
import { PutCommand, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../config/db.js";

const TableName = process.env.DYNAMO_USERS_TABLE || "Users";

export async function createUser(user) {
  await dynamo.send(new PutCommand({ TableName, Item: user }));
  return user;
}

export async function getUserByUsername(username) {
  const res = await dynamo.send(
    new GetCommand({ TableName, Key: { username } })
  );
  return res.Item;
}

export async function getUserCount() {
  // Scan with Select: 'COUNT' returns only count
  const res = await dynamo.send(
    new ScanCommand({ TableName, Select: "COUNT" })
  );
  return res.Count || 0;
}
