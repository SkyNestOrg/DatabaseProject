import React from 'react';
import axios from 'axios';
import data from './data.json'; 

const path = data.backend;
axios.defaults.baseURL = path;

import AppRoutes from './RoutePath.jsx';

export default function App() {
  return <AppRoutes />;
}