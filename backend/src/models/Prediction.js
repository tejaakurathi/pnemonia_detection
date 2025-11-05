// src/models/Prediction.js
import { GetCommand, UpdateCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../config/db.js";

const TableName = process.env.DYNAMO_PREDICTIONS_TABLE || "Predictions";

/**
 * Get predictions item by username (one item per user)
 */
export async function getPredictionsByUser(username) {
  const res = await dynamo.send(
    new GetCommand({ TableName, Key: { username } })
  );
  return res.Item;
}

/**
 * Add a new image object at the beginning of the images list.
 * imageData should be a JS object (imageUrl, prediction, confidence, segmentationMapUrl, uploadedAt)
 */
export async function addPredictionImage(username, imageData) {
  const params = {
    TableName,
    Key: { username },
    UpdateExpression:
      "SET images = list_append(:img, if_not_exists(images, :empty))",
    ExpressionAttributeValues: {
      ":img": [imageData],
      ":empty": [],
    },
    ReturnValues: "ALL_NEW",
  };

  const res = await dynamo.send(new UpdateCommand(params));
  return res.Attributes;
}

/**
 * Scan all predictions (for stats). Use cautiously for large datasets.
 */
export async function scanAllPredictions() {
  const res = await dynamo.send(new ScanCommand({ TableName }));
  return res.Items || [];
}
