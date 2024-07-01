import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { OnModuleInit } from '@nestjs/common';
import {Server,Socket} from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server :Server;

  onModuleInit() {


    this.server.on('connection',(socket :Socket)=>{

   

    const {name,token} = socket.handshake.auth;
    console.log({name,token});

    if(!name){
      socket.disconnect();
      return;
    }

    //agregar el cliente al listado
    this.chatService.onClientConnected({
      id:socket.id,
      name:name
    })

    //messaje de bienvenida
    //socket.emit('welcome-message','Bienvenido al servidor');


    //listado de clientes conectados
    this.server.emit('on-clients-changed',this.chatService.getClients());

    socket.on('disconnect', ()=>{
     // console.log('Cliente desconectado');
     this.chatService.onClientDisconnected(socket.id)
     this.server.emit('on-clients-changed',this.chatService.getClients());
    });

    });



  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() message :string,
    @ConnectedSocket() client :Socket

  ){

    const {name,token}= client.handshake.auth;

    //console.log({name,message});

    if(!message){
      return;
    }
    this.server.emit(
      'on-message',
      {
        userId:client.id,
        message:message,
        name:name

      }
  );

  }




}
