

const username =localStorage.getItem('name');


if(!username){
  window.location.replace('/');
  throw new Error('username is required');
}
//referencias html
const lblStatusOnline= document.querySelector('#status-online');
const lblStatusOffline= document.querySelector('#status-offline');
const usersUlEmlemets=  document.querySelector('ul');
const form=  document.querySelector('form');
const input=  document.querySelector('input');
const chatElement=  document.querySelector('#chat');

//renderisar usuarios conectados
const rendersUsers= (users)=> {
    usersUlEmlemets.innerHTML= '';
    users.forEach((user)=> {
        const liElement= document.createElement('li');
        liElement.innerText =user.name;
        usersUlEmlemets.appendChild(liElement)
        
    });

};

//funcion para renderizar mensages en el chat
const rendersMesasge = (payload)=>{
    const {userId,message,name}= payload;

    const divElement= document.createElement('div');

    divElement.classList.add('message');

    if(userId !== socket.id){
        divElement.classList.add('incoming');
    }

    divElement.innerHTML =`
    <small>${ name }</small> 
    <p>${ message }</p>`;
    chatElement.appendChild(divElement);


    chatElement.scrollTop= chatElement.scrollHeight;

}

// funcion para enviar mensaje por el puerto hacia el evento de emitir mensaje
form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const message = input.value;
    input.value= '';
    socket.emit('send-message',message);
    

});





//mandar informacion del usuario atraves del puerto
const socket = io({
    auth:{
        token:'ABC-123',
        name:username
    }
});

//evento de conexion
socket.on('connect',()=>{
    lblStatusOnline.classList.remove('hidden');
    lblStatusOffline.classList.add('hidden');

});

//evento de desconexion
socket.on('disconnect',()=>{
    lblStatusOnline.classList.add('hidden');
    lblStatusOffline.classList.remove('hidden');
});

//mensaje de bienvenida
socket.on('welcome-message',(data)=>{
   console.log(data);
});

//evento para cuando se conecta o se conecta otroc cliente para actualizar la lista de usuarios
socket.on('on-clients-changed',rendersUsers);


socket.on('on-message',rendersMesasge);
 



