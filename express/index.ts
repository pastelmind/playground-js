import debug from "debug";
import http from "node:http";
import app from "./app.js";

const logger = debug("app:server");

const PORT = process.env["PORT"] ?? 3000;
app.set("port", PORT);

const server = http.createServer(app);

server.listen(PORT);
server.on("listening", () => {
  const addr = server.address();
  if (!addr) {
    throw new Error("Cannot get server address");
  }
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  logger(`Listening on ${bind}`);
});
