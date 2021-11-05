import { container } from 'tsyringe';
import { io } from '../http';
import { CreateChatRoomService } from '../services/CreateChatRoomService';
import { CreateMessageService } from '../services/CreateMessageService';
import { CreateUserService } from '../services/CreateUserService';
import { GetAllUsersService } from '../services/GetAllUsersService';
import { GetChatRoomByUsersService } from '../services/GetChatRoomByUsersService';
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

    const userLogged = await getUserBySockerId.execute(socket.id)

    let room = await getChatRoomByUsersService.execute([data.idUser, userLogged.id])   

    if (room.length === 0) {
      const newRoom = await createChatRoomService.execute([data.idUser, userLogged.id])
    }
    room = await getChatRoomByUsersService.execute([data.idUser, userLogged.id])

    socket.join(room[0].room_id)
    
    callback(room[0])
  })
  socket.on('message', async data => {
    // buscar informações do usuário (soclet.id)
    
    const getUserBySockerId = container.resolve(GetUserBySocketId)
    const createMessageService = container.resolve(CreateMessageService)

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
  })
})
