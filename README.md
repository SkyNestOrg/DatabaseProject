<div align="center">
<h1 align="center">Hotel Reservation and Guest Services Management System (HRGSMS) System</h1>
</div>

## Description

SkyNest Hotels is a regional hotel chain in Sri Lanka, offering premium accommodation and services across its branches in Colombo, Kandy, and Galle. To address operational inefficiencies caused by an outdated desktop-based system including overbookings, billing delays, and manual errors the management has initiated the development of a unified Hotel Reservation and Guest Services Management System (HRGSMS). This modern solution aims to streamline bookings, automate service tracking, and enhance the overall guest experience through a centralized, scalable platform.

## Project Structure 

-**frontend**: Consists of interface for below mentioned roles in a common entry section:

- **guest**: Frontend interface for hotel guests to search and book rooms,request services, view bills and many more functions .  
- **frontdeskoffice-end**: Portal for front desk staff to manage check-ins, check-outs, guest bookings and handle payments.  
- **serviceoffice-end**: Interface for managing guest service requests, updates, and service billing.  
- **admin-end**: Admin dashboard for managing users, roles, and system configurations for app-wide tax and discounts.  
- **management-end**: Management dashboard for generating reports, monitoring performance, and viewing analytics.

-**backend**:
 Node.js/Express-based server handling APIs, jwt authentication, and database interactions.  

-**database_files**: SQL files for creating schemas, inserting initial data, and defining functions, triggers, views, procedures, and indexes.  


### Built With
<a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/2560px-Node.js_logo.svg.png" alt="nodejs" height="40"/> </a>
<a href="https://www.mysql.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/> </a>
<a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a>
<img src="https://www.svgrepo.com/show/349330/css3.svg" alt="CSS3" width="40" />

## Installation

Before running the project, ensure all required dependencies are installed in the appropriate directories.

### Steps to Install:
1. **Install Root Dependencies**:
    ```bash
    npm install
    ```
2. **Install frontend Dependencies**:
    Navigate to the `frontend` directory and install dependencies:
    ```bash
    cd frontend
    npm install
    cd ..
    ```


3. **Install Backend Dependencies**:
    Navigate to the `backend` directory and install dependencies:
    ```bash
    cd backend
    npm install
    cd ..
    ```

8. **Set up `.env` environment**:
    <br>Navigate to the `backend/` directory and create an `.env` like `.env.example` and insert your database credentials as well as jwt secret there.

## Running the Application

### Frontend 
To start the React frontend server  on `localhost:5573`, use the following command from the root directory:
```bash
npm run frontend
```

### Backend
To start the backend server on `localhost:5000`, use the following command from the root directory:
```bash
npm run backend
```

### All
To start the all servers concurrently at once, use the following command from the root directory:
```bash
npm start
```

## Containerization

Navigate to root directory.
To build and run the containers in detached mode:

```bash
docker compose -f docker-compose.dev.yml up -d
```

To stop running containers:

```bash
docker compose -f docker-compose.dev.yml down
```




## Contributors
- [Dinura Ginige](https://github.com/Dinurang)
- [Sanjuna Rathnamalala](https://github.com/SanjunaRathnamalala)
- [Pamoth Kumarasinghe](https://github.com/PamothKumarasinghe)
- [Yohan Jayasinghe](https://github.com/YohanJaya)
- [Thilakshan Balakrishnan](https://github.com/thilakshan2003)