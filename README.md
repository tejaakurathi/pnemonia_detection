# Pneumonia Detection System

A full-stack web application that detects pneumonia from chest X-ray images using a CNN model, with user authentication and a prediction history dashboard.

## Architecture

The project has three independent services that must be run together:

```
frontend (React + Vite)  →  backend (Node/Express + MongoDB)  →  model-api (FastAPI + TensorFlow)
     :5173                          :5000                                :8000
```

- **`model-api/`** — Python FastAPI service that loads a trained Keras CNN (`best_pneumonia_model.keras`) and returns a prediction for a given image array.
- **`backend/`** — Node.js/Express API that handles user auth, image upload/preprocessing, and forwards the processed image to `model-api` for inference. Stores users and prediction history in MongoDB.
- **`frontend/`** — React + Vite + Tailwind client for uploading X-rays, viewing predictions, and browsing prediction history.

**Important:** the backend only calls the real CNN if `MODEL_API_URL` (in `backend/.env`) points to a running `model-api` instance. If `model-api` isn't running or the URL isn't configured, the backend silently falls back to a non-ML brightness-based heuristic on the image (labeled internally as the "Local Sharp Heuristic Engine"). **Always start `model-api` first** to ensure predictions come from the actual trained model.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router, Framer Motion |
| Backend | Node.js, Express, MongoDB (Mongoose), JWT auth, Multer, Sharp |
| Model API | Python, FastAPI, TensorFlow/Keras |

## Prerequisites

- Node.js (v18+)
- Python 3.9+
- A MongoDB connection string (MongoDB Atlas or local)

## Setup & Run Order

Run the three services **in this order**, each in its own terminal.

### 1. Model API (start this first)

```bash
cd model-api
pip install fastapi uvicorn tensorflow numpy pydantic --break-system-packages
uvicorn app:app --reload --port 8000
```

The API loads `best_pneumonia_model.keras` on startup and serves predictions at `POST /`.

### 2. Backend

```bash
cd backend
cp .env.example .env
# edit .env: set MONGODB_URI to your MongoDB connection string
# MODEL_API_URL should already point to http://127.0.0.1:8000
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (default Vite port).

## Environment Variables

**`backend/.env`**
```
PORT=5000
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<your JWT secret>
MODEL_API_URL=http://127.0.0.1:8000
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/signup` | Register a new user |
| POST | `/api/login` | Log in, returns a JWT |
| POST | `/api/upload` | Upload a chest X-ray image, returns a prediction (auth required) |
| GET | `/api/dashboard` | Get the logged-in user's prediction history (auth required) |
| GET | `/api/stats` | Get aggregate usage stats |
| GET | `/api/health` | Health check |

## How Prediction Works

1. The frontend uploads an image to `/api/upload` with a JWT in the `Authorization` header.
2. The backend resizes the image to 224×224 with Sharp and normalizes pixel values.
3. The processed image array is sent to `model-api`, which runs it through the CNN and returns `PNEUMONIA` or `NORMAL` with a probability score.
4. The result is saved to MongoDB under the user's prediction history and returned to the frontend.

## Known Limitations

- If `model-api` is not running/reachable, the backend falls back to a simple brightness-based heuristic rather than failing outright — this is useful for local demos without GPU/model setup, but it is **not** a real prediction.
- The `/api/stats` endpoint currently returns a hardcoded `averageAccuracy` value rather than a value computed from stored predictions.
- The auth middleware function is named `authCognitoMiddleware`, a naming holdover from an earlier AWS Cognito-based version of the auth system; it now performs standard JWT verification only.
- Originally designed for AWS deployment (EC2 for compute, S3 for image storage); currently runs as a local, self-hosted deployment.

## Project Structure

```
.
├── backend/          # Express API, MongoDB models, auth, upload handling
│   └── src/
│       ├── config/        # DB connection
│       ├── controllers/    # Auth & prediction logic
│       ├── middleware/     # JWT auth middleware
│       ├── models/         # Mongoose schemas (User, Prediction)
│       └── routes/         # Express routes
├── frontend/          # React + Vite client
└── model-api/         # FastAPI service serving the trained CNN
```
