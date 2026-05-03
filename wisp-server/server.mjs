import http from 'node:http';
import { server as wisp } from '@mercuryworkshop/wisp-js/server';

const PORT = process.env.PORT || 3003;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Wisp server OK');
});

server.on('upgrade', (req, socket, head) => {
  wisp.routeRequest(req, socket, head);
});

server.listen(PORT, HOST, () => {
  console.log(`Wisp server listening on ${HOST}:${PORT}`);
});
