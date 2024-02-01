import 'dotenv/config';
import fastify from 'fastify';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const keyPath = path.resolve(__dirname, "../cert/server.key");
const crtPath = path.resolve(__dirname, "../cert/server.crt");

const app = fastify({
    https: {
        key: readFileSync(keyPath),
        cert: readFileSync(crtPath)
    }
});

app.listen({
    port: 8000,
    host: '0.0.0.0'
}).then(() => {
    console.log("HTTPS server started successfully 🔥");
});