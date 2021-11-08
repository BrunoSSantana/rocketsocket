const socket = io("http://localhost:3003");

let idChatRoom = "";
function lets() {
  const messages = document.querySelector('.message_user')
  messages.scrollTo(0, messages.scrollHeight)
}
// function getMessagens() {
//   const messages = document.querySelectorAll('.message')
//   messages.forEach(message => {
//     const messageId = message.dataset.messageId

//     const lixeira = document.querySelector('svg')

//     lixeira.addEventListener('click', () => {
//       console.log('clicou', messageId);
//     })
//     // socket.emit('delete_message', messageId)
//   })
// }

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  const avatar = urlParams.get("avatar");
  const email = urlParams.get("email");

  document.querySelector(".user_logged").innerHTML += `
    <img
      class="avatar_user_logged"
      src=${avatar}
    />
    <strong id="user_logged">${name}</strong>  
  `;

  socket.emit("start", {
    email,
    name,
    avatar,
  });

  socket.on("new_users", (user) => {
    const existInDiv = document.getElementById(`user_${user.id}`);

    if (!existInDiv) {
      addUser(user);
    }
  });

  socket.emit("get_users", (users) => {
    users.map((user) => {
      if (user.email !== email) {
        addUser(user);
      }
    });
  });

  socket.on("message", (data) => {
    if (data.message.roomId === idChatRoom) {
      addMessage(data);
    }
  });

  socket.on('notification', (data) => {
    if (data.roomId !== idChatRoom) {
      const user = document.getElementById(`user_${data.from.id}`);

      user.insertAdjacentHTML("afterbegin", ` 
        <div class="notification"></div>
      `
      );
    }
  });
}

function addMessage(data) {
  const divMessageUser = document.getElementById("message_user");

  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");

  divMessageUser.innerHTML += `
  <div 
    class="message ${data.user.name === name ? 'message_to_user': 'message_from_user'}"
    data-message-id="${data.message.id}"
  >    
    <span class="user_name user_name_date">
      <img
        class="img_user"
        src=${data.user.avatar}
      />
      <strong> ${data.user.name} &nbsp; </strong>
      <span>  ${dayjs(data.message.created_at).format("DD/MM/YYYY HH:mm")}</span>
    </span>
    <div class="messages">
      <span class="chat_message"> ${data.message.text}</span>
    </div>
    ${data.user.name === name
      ?
      `<svg id="delete" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FAFAFA">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
      </svg>`
       :
        ''
      }
  </div>
  `;
}

function addUser(user) {
  const usersList = document.getElementById("users_list");
  usersList.innerHTML += ` 
    <li
      class="user_name_list"
      id="user_${user.id}"
      idUser="${user.id}"
      >
        <img
          class="nav_avatar"
          src=${user.avatar}
        />
        ${user.name}
    </li>
  `;
}

document.getElementById("users_list").addEventListener("click", (e) => {
  const inputMessage = document.getElementById("user_message");
  inputMessage.classList.remove("hidden");

  document
    .querySelectorAll("li.user_name_list")
    .forEach((item) => item.classList.remove("user_in_focus"))  
  ;

  document.getElementById("message_user").innerHTML = "";

  if (e.target && e.target.matches("li.user_name_list")) {
    const idUser = e.target.getAttribute("idUser");

    e.target.classList.add("user_in_focus");

    const notification = document.querySelector(
      `#user_${idUser} .notification`
    );
    if (notification) {
      notification.remove();
    }

    socket.emit("start_chat", { idUser }, (response) => {
      idChatRoom = response.room.id

      response.messages.forEach((message) => {
        const data = {
          message,
          user: message.to,
        };

        addMessage(data);
      });
    });
  }
  setTimeout('lets()', 100)

  setTimeout('getMessagens()', 2000)
  
});

document.getElementById("user_message").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const message = e.target.value;

    e.target.value = "";

    const data = {
      message,
      idChatRoom,
    };
    socket.emit("message", data);
  }
});


onLoad();
