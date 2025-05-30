from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
import redis
import json
import uuid
from datetime import datetime
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-2025'
CORS(app, origins=["*"])

# Configuration SocketIO avec engineio_logger pour déboguer
socketio = SocketIO(
    app, 
    cors_allowed_origins="*", 
    async_mode="threading",
    logger=True,
    engineio_logger=True,
    ping_timeout=60,
    ping_interval=25
)

# Configuration Redis
try:
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    redis_client.ping()
    print("✅ Connexion Redis réussie")
except redis.ConnectionError:
    print("❌ Erreur de connexion Redis. Assurez-vous que Redis est démarré.")
    redis_client = None

# Stockage des utilisateurs connectés
connected_users = {}

@app.route('/')
def index():
    return {"message": "Chat API is running", "status": "success"}

@app.route('/health')
def health():
    return {"status": "healthy", "redis": redis_client is not None}

@socketio.on('connect')
def handle_connect():
    print(f"✅ Client connecté: {request.sid}")
    emit('connected', {'message': 'Connexion établie'})

@socketio.on('disconnect')
def handle_disconnect():
    user_id = request.sid
    print(f"❌ Client déconnecté: {request.sid}")
    
    if user_id in connected_users:
        user_info = connected_users[user_id]
        room_name = user_info['room']
        username = user_info['username']
        
        # Retirer l'utilisateur de la room Redis
        if redis_client:
            try:
                redis_client.srem(f"room:{room_name}:users", username)
            except Exception as e:
                print(f"Erreur Redis disconnect: {e}")
        
        # Notifier les autres utilisateurs
        emit('user_left', {
            'username': username,
            'message': f'{username} a quitté la room'
        }, room=room_name)
        
        del connected_users[user_id]

@socketio.on('join_room')
def handle_join_room(data):
    try:
        username = data.get('username', '').strip()
        room_name = data.get('room', '').strip()
        user_id = request.sid
        
        if not username or not room_name:
            emit('error', {'message': 'Username et room requis'})
            return
        
        print(f"📥 {username} tente de rejoindre la room {room_name}")
        
        # Enregistrer l'utilisateur
        connected_users[user_id] = {
            'username': username,
            'room': room_name
        }
        
        # Rejoindre la room SocketIO
        join_room(room_name)
        
        # Ajouter à Redis
        if redis_client:
            try:
                redis_client.sadd(f"room:{room_name}:users", username)
            except Exception as e:
                print(f"Erreur Redis join: {e}")
        
        # Récupérer les messages existants
        messages = get_room_messages(room_name) if redis_client else []
        
        # Confirmer la connexion
        emit('room_joined', {
            'room': room_name,
            'username': username,
            'messages': messages
        })
        
        # Notifier les autres utilisateurs
        emit('user_joined', {
            'username': username,
            'message': f'{username} a rejoint la room'
        }, room=room_name, include_self=False)
        
        print(f"✅ {username} a rejoint la room {room_name}")
        
    except Exception as e:
        print(f"Erreur join_room: {e}")
        emit('error', {'message': f'Erreur: {str(e)}'})

@socketio.on('send_message')
def handle_message(data):
    try:
        user_id = request.sid
        if user_id not in connected_users:
            emit('error', {'message': 'Vous devez rejoindre une room'})
            return
        
        user_info = connected_users[user_id]
        username = user_info['username']
        room_name = user_info['room']
        message_text = data.get('message', '').strip()
        
        if not message_text:
            return
        
        # Créer le message
        message = {
            'id': str(uuid.uuid4()),
            'username': username,
            'message': message_text,
            'timestamp': datetime.now().isoformat(),
            'room': room_name
        }
        
        # Sauvegarder dans Redis
        if redis_client:
            save_message_to_redis(room_name, message)
        
        # Diffuser le message
        socketio.emit('new_message', message, room=room_name)
        
        print(f"💬 Message de {username}: {message_text}")
        
    except Exception as e:
        print(f"Erreur send_message: {e}")
        emit('error', {'message': f'Erreur: {str(e)}'})

def save_message_to_redis(room_name, message):
    try:
        redis_client.lpush(f"room:{room_name}:messages", json.dumps(message))
        redis_client.ltrim(f"room:{room_name}:messages", 0, 99)  # Garder 100 messages max
    except Exception as e:
        print(f"Erreur sauvegarde Redis: {e}")

def get_room_messages(room_name, limit=50):
    try:
        messages_json = redis_client.lrange(f"room:{room_name}:messages", 0, limit-1)
        messages = []
        for msg_json in reversed(messages_json):
            messages.append(json.loads(msg_json))
        return messages
    except Exception as e:
        print(f"Erreur récupération messages: {e}")
        return []

if __name__ == '__main__':
    print("🚀 Démarrage du serveur Flask-SocketIO...")
    print("📡 Serveur accessible sur: http://0.0.0.0:5000")
    print("🔧 Mode: Threading (compatible avec toutes les versions Python)")
    
    # Utiliser un serveur WSGI compatible WebSocket
    socketio.run(
        app, 
        host='0.0.0.0', 
        port=5000, 
        debug=False,  # Désactiver le debug pour éviter les conflits
        use_reloader=False
    )