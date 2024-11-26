import { Server } from "socket.io";
import { Redis } from "ioredis";


const pub = new Redis({
    host: 'redis-17205.c14.us-east-1-3.ec2.redns.redis-cloud.com',
    port: 17205,
    username: 'default',
    password: 'BXJznO3VN7lmpXWRUCZbmNR8rADtVz44'
});

const sub = new Redis({
    host: 'redis-17205.c14.us-east-1-3.ec2.redns.redis-cloud.com',
    port: 17205,
    username: 'default',
    password: 'BXJznO3VN7lmpXWRUCZbmNR8rADtVz44'
});


class SocketService {
    private _io: Server;

    constructor() {
        console.log("Initializing Socket Service...")
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*"
            }
        });
        sub.subscribe("MESSAGES");

    }

    public initListeners() {
        console.log("Initialize socket listeners")
        const io = this.io;
        io.on("connect", (socket) => {
            console.log("New socket connected", socket.id);
            socket.on("event:message", async ({ message }: { message: object }) => {

                console.log("New Message recieved ", message);

                //publish this msg to redis
                console.log(message)
                await pub.publish("MESSAGES", JSON.stringify(message))
            })

        });

        sub.on('message', (channel, message) => {
            if (channel === "MESSAGES") {
                io.emit('message', message);
                console.log("New Message publishing ", message);

            }
        })

    }

    get io() {
        return this._io;
    }

}

export default SocketService;