## Toyota Nexus Monorepo

This project now contains a Vite + React frontend and a Node.js/Express backend. The frontend lives in `./frontend` and the API server in `./backend`.

### Prerequisites

- Node.js 18+
- npm 9+

### First-Time Setup

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create environment files from the examples provided:

- `backend/.env` (use `backend/.env.example` as a template)
- `frontend/.env.local` (use `frontend/.env.example` as a template)

Fill in the MongoDB connection string and Gemini API key in the backend `.env`.

```bash
# backend/.env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
PORT=4000
AUTH0_DOMAIN=dev-3nsx1ooejlmgxumy.us.auth0.com
AUTH0_AUDIENCE=http://localhost:4000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### Running the App Locally

Terminal 1 – start the API (port 4000):

```bash
cd backend
npm run dev
```

Terminal 2 – start the web app (port 3000):

```bash
cd frontend
npm start
```

### Seeding Toyota Vehicles

After configuring `backend/.env`, seed the MongoDB collection:

```bash
cd backend
npm run seed:vehicles
```

The seed script loads a curated Toyota dataset with accurate specifications and image URLs.

To verify the five showcase trims (Camry XLE, Corolla Cross XLE AWD, RAV4 Hybrid XSE, Tacoma TRD Off-Road, bZ4X Limited AWD) are present after seeding, run a quick MongoDB query or spot-check via the API. If they are missing, re-run the seed script.

### Routes & API

- Frontend dev server: http://localhost:3000
- Backend API: http://localhost:4000/api
  - `/vehicles` – list and filter Toyota models
  - `/preferences` – Auth0-protected CRUD for saved preferences
  - `/users` – Auth0-protected saved vehicles
  - `/gemini` – Auth0-protected AI recommendations and vehicle summaries

### Auth0 & Gemini

The repo is configured for the Auth0 tenant:

- Domain: `dev-3nsx1ooejlmgxumy.us.auth0.com`
- Client ID: `Bca01nu12g2WiuOO9AyrwbNJVWvzIGtv`
- Audience: `http://localhost:4000`

Set these values in the frontend `.env.local` (Vite `VITE_` variables) and backend `.env`. Provide your own MongoDB Atlas connection string and Gemini API key.

### Project Structure

```
/backend         # Express API, Mongoose models, seed scripts, Toyota dataset
/frontend        # Vite React app with Auth0 integration and API clients
README.md        # This file
```

### Useful Commands

| Location  | Command                | Description                        |
|-----------|------------------------|------------------------------------|
| backend   | `npm run dev`          | Start API with nodemon             |
| backend   | `npm run seed:vehicles`| Seed Toyota vehicle collection     |
| frontend  | `npm start`            | Start Vite dev server on port 3000 |
| frontend  | `npm run build`        | Production build                   |

### Notes

- Protected API routes require Auth0 access tokens. The frontend automatically attaches them using the Auth0 React SDK.
- If MongoDB starts empty, the backend seeds the dataset on server start.
- Images used in the dataset map to real Toyota trims to avoid mismatches.
- A manual QA checklist for the psychographic quiz and recommendation flow lives in `docs/qa/vehicle-profile.md`.

