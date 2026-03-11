'use client';

import { useState, useEffect } from 'react';

export default function SimpleTest() {
    const [message, setMessage] = useState('Loading...');
    const [terms, setTerms] = useState<any[]>([]);

    useEffect(() => {
        // Simple fetch test without any complex client-side logic
        const testGlossaryFetch = async () => {
            try {
                const response = await fetch('/api/glossary-test');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Simple test - API Response:', data);
                setTerms(data.terms || []);
                setMessage(`Found ${data.terms?.length || 0} terms`);
            } catch (error) {
                console.error('Simple test - Error:', error);
                setMessage(`Error: ${(error as Error).message}`);
            }
        };

        testGlossaryFetch();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Simple Glossary Test</h1>
            <p><strong>Status:</strong> {message}</p>
            
            {terms.length > 0 && (
                <div>
                    <h3>Terms Found:</h3>
                    <ul>
                        {terms.slice(0, 5).map((term: any, index) => (
                            <li key={index}>
                                <strong>{term.term}</strong> - {term.category}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
                <h3>Browser Extension Test</h3>
                <p>If you see JavaScript errors in console, try:</p>
                <ul>
                    <li>Disable browser extensions temporarily</li>
                    <li>Try incognito/private browsing mode</li>
                    <li>Clear browser cache and cookies</li>
                    <li>Try different browser</li>
                </ul>
            </div>
        </div>
    );
}
