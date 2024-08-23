import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RespondToTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in again.');
          return;
        }
        console.log('Fetching tickets with token:', token); // Debugging line
        const response = await axios.get('http://localhost:4000/ticket/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Fetched tickets:', response.data); // Debugging line
        setTickets(response.data.tickets || []); // Ensure `tickets` is an array
      } catch (error) {
        console.error('Error fetching tickets:', error); // Debugging line
        setError('Failed to fetch tickets. Please try again later.');
      }
    };

    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedTicketId) {
      setError('Please select a ticket before submitting.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }

    try {
      await axios.patch(`http://localhost:4000/ticket/respond/${selectedTicketId}`, { message }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('successfully Responded!');
      setMessage(''); 
    } catch (err) {
    
      setError(err.response?.data?.message || 'An error occurred while submitting the response.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Respond to Ticket</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Select Ticket</label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={selectedTicketId}
            onChange={(e) => setSelectedTicketId(e.target.value)}
            required
          >
            <option value="">Select a ticket</option>
            {tickets.length > 0 ? (
              tickets.map(ticket => (
                <option key={ticket._id} value={ticket._id}>
                  {ticket.name || 'No Name'} {/* Adjust based on your ticket properties */}
                </option>
              ))
            ) : (
              <option value="">No tickets available</option>
            )}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Response</label>
          <textarea
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={!selectedTicketId} 
        >
          Submit Response
        </button>
      </form>
    </div>
  );
};

export default RespondToTicket;
