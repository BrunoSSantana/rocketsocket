import { container } from 'tsyringe';
import { io } from '../http';
import { CreateChatRoomService } from '../services/CreateChatRoomService';
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
    console.log('tem room', room);

    callback(room)
  })
})
