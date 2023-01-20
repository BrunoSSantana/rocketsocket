import { FormEvent, useState } from "react";
import { socket } from "./lib/socket-io";

import "./styles/global.css";

export function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ name, email, avatar });

    socket.emit("start", {
      email,
      name,
      avatar,
    });
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-5xl">
        <form
          action=""
          className="gb-white shadow-md rounded px-8 pt-6 pb-12 mb-8"
          onSubmit={handleSubmit}
        >
          <div className="mb-8">
            <label
              htmlFor="username"
              className="block text-white text-sm font-bold mb-2"
            >
              Nome
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              name="name"
              type="text"
              placeholder="Digite seu Nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="username"
              className="block text-white text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="text"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="username"
              className="block text-white text-sm font-bold mb-2"
            >
              Avatar
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="avatar"
              name="avatar"
              type="text"
              placeholder="Url do avatar"
              value={avatar}
              onChange={(event) => setAvatar(event.target.value)}
            />
          </div>

          <div className="md:flex md:items-center">
            <div className="md:w-2/3">
              <button
                type="submit"
                className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              >
                Acessar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
