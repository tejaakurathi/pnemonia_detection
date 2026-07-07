from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
import numpy as np

app = FastAPI()

print("Loading model...")
model = tf.keras.models.load_model("best_pneumonia_model.keras")
print("Model loaded!")

class PredictionRequest(BaseModel):
    instances: list

@app.post("/")
async def predict(req: PredictionRequest):

    # Convert incoming image to numpy array
    img = np.array(req.instances[0], dtype=np.float32)

    print("Before normalization")
    print("Shape:", img.shape)
    print("Min:", img.min())
    print("Max:", img.max())

    # Match training preprocessing
    

    print("After normalization")
    print("Shape:", img.shape)
    print("Min:", img.min())
    print("Max:", img.max())

    # Add batch dimension
    img = np.expand_dims(img, axis=0)

    # Predict
    prediction = model.predict(img)

    print("Raw prediction:", prediction)

    probability = float(prediction[0][0])

    # Convert to class
    result = "PNEUMONIA" if probability > 0.5 else "NORMAL"

    print(f"Probability: {probability:.4f}")
    print("Prediction:", result)

    return {
        "prediction": result,
        "probability": probability
    }