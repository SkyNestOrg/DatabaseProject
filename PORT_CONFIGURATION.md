# Frontend Port Configuration

This document outlines the port configuration for each role-based frontend in the Hotel Management System.

## Port Assignments

| Role | Frontend Directory | Port | URL | Status |
|------|-------------------|------|-----|---------|
| Service Office | `serviceoffice-end` | 5173 | http://localhost:5173 | ✅ Configured |
| Guest | `guest-end` | 5174 | http://localhost:5174 | ✅ Configured |
| Admin | `admin-end` | 5175 | http://localhost:5175 | 🔲 Not configured |
| Management | `management-end` | 5176 | http://localhost:5176 | 🔲 Not configured |
| Front Desk Office | `frontdeskoffice-end` | 5177 | http://localhost:5177 | 🔲 Not configured |

## Backend Configuration

The backend server (running on port 5000) has been updated with CORS configuration to accept requests from all the above frontend ports:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',  // Default React dev server
    'http://localhost:3001',  // Alternative React port
    'http://localhost:5173',  // Service Office (Vite)
    'http://localhost:5174',  // Guest End (Vite)
    'http://localhost:5175',  // Admin End (Vite)
    'http://localhost:5176',  // Management End (Vite)
    'http://localhost:5177',  // Front Desk Office End (Vite)
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

## Development Commands

### Service Office (Port 5173)
```bash
cd serviceoffice-end
npm run start:vite    # Using Vite
# OR
npm start             # Using Create React App
```

### Guest End (Port 5174)
```bash
cd guest-end
npm run dev           # Using Vite
```

## Environment Files

Each frontend should have its own `.env` file with the appropriate port configuration:

### Service Office `.env`:
```
PORT=5173
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_API_SERVICE_PREFIX=/service
```

## Benefits of This Configuration

1. **Clear Role Separation**: Each role has its own dedicated port
2. **No Port Conflicts**: Different roles can run simultaneously
3. **Easy Development**: Developers can work on multiple frontends simultaneously
4. **Better Organization**: Clear mapping between roles and their respective applications
5. **Future Scalability**: Easy to add more roles with designated ports

## Notes

- The Service Office frontend has been configured with both Vite and Create React App support
- Vite provides faster development experience with Hot Module Replacement (HMR)
- Backend CORS is pre-configured for all planned frontend ports
- Authentication and role-based routing will redirect users to their respective frontend applications