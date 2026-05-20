
const socket = new SockJS("http://localhost:8080/ws");
const stompClient = Stomp.over(socket);

stompClient.connect({}, function () {
    console.log("WebSocket conectado");

    stompClient.subscribe("/topic/calificaciones", function (mensaje) {
        const calificacion = JSON.parse(mensaje.body);
        console.log("Nueva calificación recibida:", calificacion);

        // Dispara un evento personalizado para que otros JS lo escuchen
        const evento = new CustomEvent("nuevaCalificacion", { detail: calificacion });
        document.dispatchEvent(evento);
    });
});

stompClient.connect({}, function () {
    console.log("✅ WebSocket conectado");
    stompClient.subscribe("/topic/calificaciones", function (mensaje) {
        const calificacion = JSON.parse(mensaje.body);
        console.log("Nueva calificación recibida:", calificacion);
        const evento = new CustomEvent("nuevaCalificacion", { detail: calificacion });
        document.dispatchEvent(evento);
    });
}, function(error) {
    console.log("❌ Error WebSocket:", error);
});

export { stompClient };