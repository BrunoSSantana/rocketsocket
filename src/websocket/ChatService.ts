import { container } from 'tsyringe';
import { io } from '../http';
import { CreateChatRoomService } from '../services/CreateChatRoomService';
import { CreateMessageService } from '../services/CreateMessageService';
import { CreateUserService } from '../services/CreateUserService';
import { GetAllUsersService } from '../services/GetAllUsersService';
import { GetChatRoomByIdService } from '../services/GetChatRoomByIdService';
import { GetChatRoomByUsersService } from '../services/GetChatRoomByUsersService';
import { GetMessageByChatRoomService } from '../services/GetMessageByChatRoomService';
import { GetUserBySocketId } from '../services/GetUserBySocketId';

io.on('connect', socket => {
  socket.on('start', async data => {
    const { email, avatar, name } = data
    const createUserService = container.resolve(CreateUserService)

    const user = await createUserService.execute({ email, avatar, name, socket_id: socket.id })

    socket.broadcast.emit('new_users', user)
  })
  socket.on('get_users', async (callback) => {
    const getAllUsersService = container.resolve(GetAllUsersService)

    const users = await getAllUsersService.execute()

    callback(users)

  })

  socket.on('start_chat', async (data, callback) => {
    const createChatRoomService = container.resolve(CreateChatRoomService)
    const getChatRoomByUsersService = container.resolve(GetChatRoomByUsersService)
    const getUserBySockerId = container.resolve(GetUserBySocketId)
    const getMessageByChatRoomService = container.resolve(GetMessageByChatRoomService)

    const userLogged = await getUserBySockerId.execute(socket.id)

    let room: any = await getChatRoomByUsersService.execute([data.idUser, userLogged.id])

    if (!room) {
      room = await createChatRoomService.execute([data.idUser, userLogged.id])
    }
    room = await getChatRoomByUsersService.execute([data.idUser, userLogged.id])

    socket.join(room.id)

    // Buscar mensagens da sala
    const messages = await getMessageByChatRoomService.execute(room.id)

    callback({ room: room, messages })
  })
  socket.on('message', async data => {
    // buscar informações do usuário (soclet.id) 
    const getUserBySockerId = container.resolve(GetUserBySocketId)
    const createMessageService = container.resolve(CreateMessageService)
    const getChatRoomByIdService = container.resolve(GetChatRoomByIdService)

    const user = await getUserBySockerId.execute(socket.id)

    // salvar a mensagem
    const message = await createMessageService.execute({
      to: user.id,
      text: data.message,
      room_id: data.idChatRoom
    })

    // enviar a mensagem para outros usuários da sala
    io.to(data.idChatRoom).emit('message', {
      message,
      user,
    })

    // enviar notificação de mensagem para usuário específico
    const room = await getChatRoomByIdService.execute(data.idChatRoom)

    const userFrom = room.users.find(response => response.user_id !== user.id)

    io.to(userFrom.user.socket_id).emit('notification', {
      newMessage: true,
      roomId: data.idChatRoom,
      from: user
    })
  })
  // socket.on('delete_message', async data => {
  //   console.log('delete', data);

  // })
})
