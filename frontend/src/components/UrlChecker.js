import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UptimeChart from './UptimeChart';


const UrlChecker = () => {
  const [urls, setUrls] = useState('');
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch past URL check history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/health/history');
        setHistory(res.data);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };
    fetchHistory();
  }, []);

  // Handle URL check submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlList = urls.split('\n').map((url) => url.trim()).filter(Boolean);

    if (urlList.length === 0) {
      setError('Please enter at least one URL.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/health/check', { urls: urlList });
      setResults(res.data);
    } catch (err) {
      console.error('Error checking URLs:', err);
      setError('Failed to check URLs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>🌐 URL Health Monitor</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          rows="6"
          cols="60"
          placeholder="Enter URLs, one per line"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          style={{ fontSize: '14px', padding: '8px' }}
        />
        <br />
        <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '8px 16px' }}>
          {loading ? 'Checking...' : 'Check URLs'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>🔎 Current Results</h3>
      {results.length > 0 ? (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>URL</th>
              <th>Status</th>
              <th>Response Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, idx) => (
              <tr key={idx}>
                <td>{item.url}</td>
                <td style={{ color: item.status === 'UP' ? 'green' : 'red' }}>{item.status}</td>
                <td>{item.responseTime} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results yet.</p>
      )}

      <h3>📜 History (Last 100 Checks)</h3>
      {history.length > 0 ? (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>URL</th>
              <th>Status</th>
              <th>Response Time</th>
              <th>Checked At</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={idx}>
                <td>{item.url}</td>
                <td style={{ color: item.status === 'UP' ? 'green' : 'red' }}>{item.status}</td>
                <td>{item.responseTime} ms</td>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No history available.</p>
      )}
      <UptimeChart />

    </div>
    
  );
};

export default UrlChecker;
