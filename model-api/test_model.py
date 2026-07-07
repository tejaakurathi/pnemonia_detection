import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os

model = tf.keras.models.load_model("best_pneumonia_model.keras")

def predict_image(path):
    img = image.load_img(path, target_size=(224, 224))
    img = image.img_to_array(img)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    pred = model.predict(img, verbose=0)
    return float(pred[0][0])

# CHANGE THESE PATHS TO YOUR DATASET LOCATION
normal_dir = r"D:\chest_xray\test\NORMAL"
pneumonia_dir = r"D:\chest_xray\test\PNEUMONIA"

print("========== NORMAL IMAGES ==========")

for f in os.listdir(normal_dir)[:10]:
    path = os.path.join(normal_dir, f)
    p = predict_image(path)
    print(f"{f} -> {p:.4f}")

print("\n========== PNEUMONIA IMAGES ==========")

for f in os.listdir(pneumonia_dir)[:10]:
    path = os.path.join(pneumonia_dir, f)
    p = predict_image(path)
    print(f"{f} -> {p:.4f}")