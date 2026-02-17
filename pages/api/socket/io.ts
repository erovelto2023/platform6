import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types/socket";

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false,
        });

        io.on("connection", (socket) => {
            socket.on("message:new", (message) => {
                socket.broadcast.emit("message:new", message);
            });

            socket.on("unread:update", (data) => {
                socket.broadcast.emit("unread:update", data);
            });
        });

        res.socket.server.io = io;
    }

    res.end();
};

export default ioHandler;
