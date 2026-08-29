/* eslint-disable prettier/prettier */
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway({cors: {origin: '*'}})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect{
    handleConnection(socket: Socket) {
        console.log(`Connected: ${socket.id}`);
    }

    handleDisconnect(socket: Socket) {
        console.log(`Disconnected: ${socket.id}`);
    }
}