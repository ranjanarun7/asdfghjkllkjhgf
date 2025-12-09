
import React, { useEffect, useState } from 'react';

const ChainView = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkChain = async () => {
        try {
            // New Chain API Health Check
            const response = await fetch('http://localhost:3001/api/health');
            if (!response.ok) {
                throw new Error('Failed to connect to chain');
            }
            const result = await response.json();
            setStatus(result);
            setError(null);
        } catch (err) {
            setError(err.message);
            setStatus(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkChain();
        const interval = setInterval(checkChain, 10000); // Check every 10s
        return () => clearInterval(interval);
    }, []);

    const containerStyle = {
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    };

    const statusCardStyle = {
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '30px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'inline-block',
        minWidth: '300px'
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ color: '#333', marginBottom: '30px' }}>Online Tourism Chain</h1>

            <div style={statusCardStyle}>
                {loading && <p>Connecting to Blockchain...</p>}

                {error && (
                    <div style={{ color: '#e74c3c' }}>
                        <h3>🔴 Offline</h3>
                        <p>{error}</p>
                        <small>Make sure the chain server is running on port 3000</small>
                    </div>
                )}

                {status && (
                    <div style={{ color: '#27ae60' }}>
                        <h2 style={{ fontSize: '2.5em', margin: '10px 0' }}>🟢 Online</h2>
                        <p><strong>Contract:</strong> {status.contract}</p>
                        <p><strong>Wallet:</strong> {status.wallet}</p>
                        <hr style={{ margin: '20px 0', opacity: 0.3 }} />
                        <p style={{ color: '#666' }}>
                            All transactions are now being recorded to the live contract.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChainView;
