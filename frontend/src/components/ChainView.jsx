
import React, { useEffect, useState } from 'react';

const ChainView = () => {
    const [chainData, setChainData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchChain = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/chain');
            if (!response.ok) {
                throw new Error('Failed to fetch blockchain data');
            }
            const result = await response.json();
            setChainData(result.chain.reverse()); // Show newest first
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChain();
        const interval = setInterval(fetchChain, 5000); // Auto-refresh every 5s
        return () => clearInterval(interval);
    }, []);

    const containerStyle = {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    };

    const blockStyle = {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
        marginBottom: '10px',
        color: '#555'
    };

    const hashStyle = {
        fontSize: '0.85em',
        color: '#888',
        wordBreak: 'break-all',
        fontFamily: 'monospace'
    };

    const dataStyle = {
        backgroundColor: '#f9f9f9',
        padding: '10px',
        borderRadius: '4px',
        overflowX: 'auto'
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Local Chain Ledger</h1>

            {loading && <p style={{ textAlign: 'center' }}>Loading Chain...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}

            {!loading && !error && (
                <div>
                    <p style={{ textAlign: 'center', color: '#666' }}>
                        Total Blocks: {chainData.length} | Status: Online 🟢
                    </p>
                    {chainData.map((block) => (
                        <div key={block.index} style={blockStyle}>
                            <div style={headerStyle}>
                                <strong>Block #{block.index}</strong>
                                <span>{new Date(block.timestamp).toLocaleString()}</span>
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <strong>Data:</strong>
                                <pre style={dataStyle}>
                                    {JSON.stringify(block.data, null, 2)}
                                </pre>
                            </div>

                            <div style={hashStyle}>
                                <strong>Hash:</strong> {block.hash}
                                <br />
                                <strong>Prev:</strong> {block.previousHash}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChainView;
