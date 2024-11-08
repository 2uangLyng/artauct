import PayOS from "@payos/node";

if (!process.env.PAYOS_CLIENT_ID && !process.env.PAYOS_API_KEY && !process.env.PAYOS_CHECKSUM_KEY) {
    throw new Error('PAYOS_SECRET_KEY is not set');
}

const clientId = process.env.PAYOS_CLIENT_ID as string;
const apiKey = process.env.PAYOS_API_KEY as string;
const checksumKey = process.env.PAYOS_CHECKSUM_KEY as string;

const payos = new PayOS(clientId, apiKey, checksumKey);

export default payos;

