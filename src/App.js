import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Users from './components/Users';
import Roles from './components/Roles';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/roles" element={<Roles />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
