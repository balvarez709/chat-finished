const socket = io();

let user;
let chatBox = document.getElementById("chat-box");

Swal.fire({
  title: "Identificate para ingresar",
  input: "text",
  text: "¡Ingresa tu nombre para identificarte en el chat!",
  inputValidator: (value) => {
    return !value && "¡Necesitas escribir un nombre de usuario para continuar!";
  },
  allowOutsideClick: false
}).then((result) => {
  user = result.value
  socket.emit("user-login", user)
});

chatBox.addEventListener("keyup", (e) => {
  if(e.key === "Enter") {
    if(chatBox.value.trim().length) {
      socket.emit("message", { user, message: chatBox.value })
      chatBox.value = "";
    }
  }
})

// SOCKET
socket.on("messageLogs", (data) => {
  const log = document.getElementById("message-logs");
  let messages = "";
  data.forEach(msg => {
    messages += `<p>${msg.user} dice: ${msg.message}</p>`
  })

  log.innerHTML = messages;
})

socket.on("new-user", (data) => {
  if(!user) return
  Swal.fire({
    text: `¡${data} se a conectado al chat!`,
    toast: true,
    position: "top-right"
  })
})