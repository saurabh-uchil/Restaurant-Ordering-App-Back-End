/* eslint-disable prettier/prettier */
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({cors: {origin: '*'}})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect{

    @WebSocketServer()
    server!: Server;

    handleConnection(socket: Socket) {
        //console.log(`Connected: ${socket.id}`);
    }

    handleDisconnect(socket: Socket) {
        //console.log(`Disconnected: ${socket.id}`);
    }

    @SubscribeMessage('joinRoom')
    handleMessage(socket: Socket, message: any) {
        //console.log(socket.id+" : "+message);
        socket.emit('joinedRoom', " Joined room: "+message);
    }

    handleOrderUpdate(orderId: number, orderStatus: string) {
       //console.log(`Order Update: Order ID ${orderId} has changed status to ${orderStatus}`);
       this.server.emit('orderUpdate', { orderId, orderStatus });
    }

    handleCustomerOrderUpdate(orderId: number, orderStatus: string) {
        console.log(`Customer Order Update: Order ID ${orderId} has changed status to ${orderStatus}`);
        this.server.emit('customerOrderUpdate', { orderId, orderStatus });
    }
}