import { server } from "./http";
import "./websocket/ChatService";

server.listen(3003, () => console.log("🔥 🚀"));
