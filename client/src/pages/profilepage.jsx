import React from 'react';
import { useAuth } from '../contexts/authcontexts.jsx';
const profilepage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>You are not authenticated</div>;
  }

  return <h1>{user.name}</h1>;
};

export default profilepage;
