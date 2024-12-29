import React, { useState } from 'react';
import { Button, Alert, AlertIcon, AlertTitle, AlertDescription } from '@coinbase/onchainkit';

export function PanicButton({ onPanic }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handlePanic = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/panic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to initiate panic stop.');
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button
                colorScheme="red"
                onClick={handlePanic}
                isLoading={loading}
                loadingText="Activating"
            >
                Panic Stop
            </Button>

            {error && (
                <Alert status="error" marginTop="2">
                    <AlertIcon />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert status="success" marginTop="2">
                    <AlertIcon />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>Panic stop initiated. All open orders are being cancelled.</AlertDescription>
                </Alert>
            )}
        </div>
    );
}