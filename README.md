Setting up Admin End
____________________________________________
Step 1: Backend Setup

Create .env file in backend directory:

_**DB_HOST=localhost \n
DB_USER=username \n
DB_PASSWORD=your_db_password \n
DB_NAME=your_db_name \n
PORT=5000 \n
JWT_SECRET=your_jwt_secret**_

On admin-end directory, Run:

_**cd backend \n
npm install \n
npm start**_

You should see:

_**🚀 Server running on port 5000 \n
📍 Health check: http://localhost:5000/api/health**_

____________________________________________
Step 2: Frontend Setup (in a new terminal)

On admin-end directory, Run:

_**cd frontend \n
npm install \n
npm run dev**_
