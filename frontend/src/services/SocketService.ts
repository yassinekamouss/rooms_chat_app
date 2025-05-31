import io, { Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private readonly serverUrl = "http://192.168.110.185:5000"; // Remplacez par votre IP

  connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      this.socket = io(this.serverUrl, {
        transports: ["websocket"],
        timeout: 5000,
      });

      this.socket.on("connect", () => {
        console.log("✅ Connecté au serveur");
        resolve(this.socket!);
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ Erreur de connexion:", error);
        reject(error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(username: string, room: string) {
    this.socket?.emit("join_room", { username, room });
  }

  sendMessage(message: string) {
    this.socket?.emit("send_message", { message });
  }

  onRoomJoined(callback: (data: any) => void) {
    this.socket?.on("room_joined", callback);
  }

  onNewMessage(callback: (data: any) => void) {
    this.socket?.on("new_message", callback);
  }

  onUserJoined(callback: (data: any) => void) {
    this.socket?.on("user_joined", callback);
  }

  onUserLeft(callback: (data: any) => void) {
    this.socket?.on("user_left", callback);
  }

  onError(callback: (data: any) => void) {
    this.socket?.on("error", callback);
  }

  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export default new SocketService();
