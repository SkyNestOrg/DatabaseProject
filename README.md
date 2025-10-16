## Setting up Admin End

### Step 1: Backend Setup

1.  **Create `.env` file** in the **`backend`** directory with the following content:

    ```env
    DB_HOST=localhost
    DB_USER=username
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    PORT=5000
    JWT_SECRET=your_jwt_secret
    ```

2.  **Install and Start** the backend server. From the **`admin-end`** root directory, run:

    ```bash
    cd backend
    npm install
    npm start
    ```

    You should see output similar to:

    ```
    🚀 Server running on port 5000 
    📍 Health check: http://localhost:5000/api/health
    ```
---
### Step 2: Frontend Setup (in a new terminal)

1.  **Open a new terminal window**.
2.  **Install and Run** the frontend. From the **`admin-end`** root directory, run:

    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The frontend should now be running port 3000.
