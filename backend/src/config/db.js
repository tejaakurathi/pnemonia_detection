// src/config/db.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export let dynamo; // will be initialized in connectToDatabase()

export async function connectToDatabase() {
  const region = process.env.AWS_REGION;
  if (!region) throw new Error("Missing AWS_REGION env var");
  const client = new DynamoDBClient({ region });
  dynamo = DynamoDBDocumentClient.from(client);
  console.log("✅ DynamoDB client ready");
}
