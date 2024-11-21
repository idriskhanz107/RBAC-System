import React, { useEffect, useState } from 'react';

const UserDashboard = () => {
  const [data, setData] = useState(null); // State to hold the fetched data
  const [error, setError] = useState(null); // State to hold any error messages

  useEffect(() => {
    // Fetch data from API
    fetch('http://localhost:5000/api/data')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data); // Store data in state
      })
      .catch((error) => {
        setError(error.message); // Store error in state if request fails
      });
  }, []); // Empty dependency array means this runs only once when component mounts

  if (error) {
    return <div>Error: {error}</div>; // Show error message if there's an error
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre> // Show the fetched data
      ) : (
        <p>Loading...</p> // Show loading message while waiting for data
      )}
    </div>
  );
};

export default UserDashboard;
