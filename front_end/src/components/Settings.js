import React, { useState } from 'react';
import { Box, Heading, TextField, Button } from '@coinbase/onchainkit';

export function Settings({ settings, onSave }) {
    const [apiKey, setApiKey] = useState(settings.apiKey || '');
    const [apiSecret, setApiSecret] = useState(settings.apiSecret || '');
    const [webhookUrl, setWebhookUrl] = useState(settings.webhookUrl || '');

    const handleSave = () => {
        onSave({ apiKey, apiSecret, webhookUrl });
    };

    return (
        <Box marginTop={4}>
            <Heading as="h3" size="sm">Settings</Heading>
            <TextField label="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            <TextField label="API Secret" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} type="password" />
            <TextField label="Webhook URL" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
            <Button onClick={handleSave}>Save Settings</Button>
        </Box>
    );
}