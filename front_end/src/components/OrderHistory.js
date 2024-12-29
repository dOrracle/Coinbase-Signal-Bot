import React from 'react';
import { Box, Table, Thead, Tr, Th, Tbody, Td } from '@coinbase/onchainkit';

export function OrderHistory({ orderHistory }) {
    return (
        <Box marginTop={4}>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Order ID</Th>
                        <Th>Signal ID</Th>
                        <Th>Status</Th>
                        <Th>Details</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {orderHistory.map((order) => (
                        <Tr key={order.order_id}>
                            <Td>{order.order_id}</Td>
                            <Td>{order.signal_id}</Td>
                            <Td>{order.status}</Td>
                            <Td>{JSON.stringify(order.details)}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
}