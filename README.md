# TalkRooms - Votre Hub de Communication en Temps Réel 🚀

Bienvenue sur **TalkRooms**, une application de chat moderne, interactive et ultra-rapide conçue pour connecter les gens à travers des salles de discussion thématiques (_rooms_) en **temps réel**. Plongez dans des conversations fluides et dynamiques sur **mobile ET web** !

[![React Native](https://img.shields.io/badge/React%20Native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-%23000020.svg?style=for-the-badge&logo=expo&logoColor=%23fff)](https://expo.dev/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=%23fff)](https://flask.palletsprojects.com/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)
[![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## Aperçu Multi-Plateforme

TalkRooms Pro réinvente la communication instantanée sur **toutes les plateformes** :

- **Rejoignez des Rooms :** Connectez-vous facilement avec un pseudo et un ID de salle
- **Messagerie Instantanée :** Échangez des messages qui apparaissent comme par magie
- **Qui est en Ligne ?** Visualisez la liste des participants actifs en temps réel
- **Notifications Intelligentes :** Soyez alerté des arrivées et départs
- **Multi-Plateforme :** Disponible sur mobile (iOS/Android) ET navigateur web
- **Monitoring Avancé :** API de statistiques et gestion automatique des données

---

## Architecture Robuste Multi-Client

TalkRooms Pro s'appuie sur des technologies de pointe pour une expérience optimale sur tous les appareils :

### Backend Unifié (Python / Flask)
- **Framework Puissant** : Flask & Flask-SocketIO pour une gestion temps réel performante
- **Base de Données Ultra-Rapide** : Redis pour la persistance des messages avec expiration automatique
- **Communication Magique** : WebSockets pour des échanges instantanés
- **Support Multi-Client** : API REST + rendu de templates pour le web
- **Nettoyage Automatique** : Gestion intelligente de la rétention des données

### Frontend Mobile (React Native / Expo)
- **Expérience Native** : React Native & Expo pour une application mobile cross-platform fluide
- **Navigation Intuitive** : React Navigation v7 pour des transitions élégantes
- **Client WebSocket Efficace** : Socket.IO Client pour une connexion stable
- **UI Moderne & Animée** : Interface utilisateur soignée avec animations subtiles

### Frontend Web (HTML5 / CSS3 / JavaScript)
- **Interface Web Responsive** : Templates HTML5 modernes avec CSS3 avancé
- **Temps Réel Web** : Socket.IO côté client pour synchronisation parfaite
- **Design Cohérent** : Même palette de couleurs et UX que l'app mobile
- **Expérience Optimisée** : Pas besoin d'installation, fonctionne dans tout navigateur

---

## Fonctionnalités Clés

### Authentification Simplifiée
- Connexion rapide via nom d'utilisateur et ID de room
- Validation des champs pour éviter les erreurs
- Suggestions de rooms populaires (general, random, tech)

### Chat en Temps Réel Cross-Platform
- Messages instantanés avec confirmation visuelle
- Horodatage précis pour chaque message
- Avatars colorés uniques générés dynamiquement
- Synchronisation parfaite entre mobile et web

### Interface Utilisateur Soignée
- Design moderne, épuré et responsive
- Animations fluides pour une expérience utilisateur agréable
- Palette de couleurs cohérente (#2C3E50, #4ECDC4, #ECF0F1)
- Mode sombre pour les en-têtes
- Indicateurs d'état clairs

### Notifications Système Intelligentes
- Messages de bienvenue personnalisés avec icônes
- Notifications d'arrivée et de départ des utilisateurs
- Compteur d'utilisateurs connectés en temps réel
- Indicateur de frappe ("Vous tapez...")

### Persistance des Données Intelligente
- Historique des messages sauvegardé via Redis
- **Expiration automatique** : Messages (7 jours), Utilisateurs (2h), Rooms (1 jour)
- Récupération automatique de l'historique à la reconnexion
- Limitation à 100 messages par room pour optimiser les performances
- Nettoyage automatique des rooms inactives

### Monitoring et APIs
- API de santé du serveur (`/api/health`)
- Statistiques des rooms actives (`/api/rooms`)
- Monitoring de l'utilisation Redis (`/api/stats`)
- Tâche de nettoyage automatique en arrière-plan

---

## Installation et Configuration

Préparez-vous à chatter en quelques étapes sur toutes les plateformes !

### Prérequis

#### Backend
- Python 3.8+
- Redis Server
- pip (gestionnaire de paquets Python)

#### Frontend Mobile
- Node.js 16+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Smartphone avec Expo Go ou émulateur Android/iOS

#### Frontend Web
- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- Connexion à votre serveur backend

---

### Configuration du Backend

1. **Clonez le repository :**
   ```bash
   git clone <votre-repository-url>
   cd chat_app/backend
   ```

2. **Créez et activez l'environnement virtuel :**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Installez les dépendances Python :**
   ```bash
   pip install flask flask-socketio flask-cors redis python-dotenv
   ```
   
   Ou créez un fichier `requirements.txt` :
   ```txt
   flask==3.0.0
   flask-socketio==5.3.6
   flask-cors==4.0.0
   redis==5.0.1
   python-dotenv==1.0.0
   ```
   Puis : `pip install -r requirements.txt`

4. **Démarrez Redis :**
   ```bash
   # Ubuntu/Debian
   sudo service redis-server start
   
   # macOS (Homebrew)
   brew services start redis
   
   # Windows (Docker)
   docker run -d -p 6379:6379 redis:alpine
   
   # Vérification
   redis-cli ping  # Doit retourner "PONG"
   ```

5. **Créez le dossier templates et static :**
   ```bash
   mkdir -p templates static/css static/js
   ```

6. **Démarrez le serveur :**
   ```bash
   python app.py
   ```
   Le serveur sera accessible sur :
   - **Backend API** : `http://0.0.0.0:5000`
   - **Interface Web** : `http://localhost:5000`
   - **API Mobile** : `http://localhost:5000/api/*`

---

### Configuration du Frontend Mobile

1. **Naviguez vers le dossier frontend :**
   ```bash
   cd ../frontend
   ```

2. **Installez les dépendances :**
   ```bash
   npm install
   ```

3. **Configurez l'adresse du serveur :**
   Modifiez `frontend/src/services/SocketService.ts` :
   ```typescript
   private readonly serverUrl = 'http://VOTRE_IP:5000';
   // Remplacez VOTRE_IP par l'adresse IP de votre machine
   // Ex: 192.168.1.100:5000
   ```

4. **Démarrez l'application :**
   ```bash
   npm start
   ```
   Scannez le QR code avec Expo Go ou utilisez un émulateur.

---

### Configuration du Frontend Web

**Aucune configuration nécessaire !** Une fois le backend démarré :

1. **Ouvrez votre navigateur**
2. **Naviguez vers** : `http://localhost:5000`
3. **Commencez à chatter !**

L'interface web inclut :
- Page de connexion responsive
- Interface de chat en temps réel
- Liste des rooms actives
- Même fonctionnalités que l'app mobile

---

## API et Communication

### 📡 Routes Web
- `GET /` : Page d'accueil avec formulaire de connexion
- `POST /join` : Traitement du formulaire de connexion
- `GET /chat` : Page de chat avec paramètres username et room
- `GET /api/health` : Statut de santé du serveur
- `GET /api/rooms` : Liste des rooms actives
- `GET /api/stats` : Statistiques Redis et monitoring

### Événements Socket.IO

#### Événements Émis (Client → Serveur)
- `join_room` : `{ username: string, room: string }`
- `send_message` : `{ message: string }`
- `disconnect` : Déconnexion automatique

#### Événements Reçus (Serveur → Client)
- `connected` : `{ message: string }`
- `room_joined` : `{ room: string, username: string, messages: Message[] }`
- `new_message` : `Message`
- `user_joined` : `{ username: string, message: string }`
- `user_left` : `{ username: string, message: string }`
- `error` : `{ message: string }`

### Structure des Messages
```typescript
interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: string; // ISO 8601
  room: string;
  type?: 'message' | 'notification';
}
```

---

## Structure du Projet

```
chat_app/
├── backend/
│   ├── app.py                    # Serveur Flask-SocketIO principal
│   ├── .env                      # Variables d'environnement
│   ├── requirements.txt          # Dépendances Python
│   ├── templates/                # Templates HTML pour le web
│   │   ├── index.html           # Page de connexion web
│   │   └── chat.html            # Page de chat web
│   └── static/                   # Assets statiques web
│       ├── css/
│       │   └── style.css        # Styles CSS responsive
│       └── js/
│           └── chat.js          # Logique chat côté client web
├── frontend/                     # Application mobile React Native
│   ├── App.tsx                  # Point d'entrée mobile
│   ├── app.json                 # Configuration Expo
│   ├── package.json             # Dépendances npm
│   └── src/
│       ├── screens/
│       │   ├── LoginScreen.tsx  # Écran de connexion mobile
│       │   └── ChatScreen.tsx   # Écran de chat mobile
│       └── services/
│           └── SocketService.ts # Service de communication mobile
└── README.md                    # Documentation complète
```

---

## Utilisation Multi-Plateforme

### Démarrage Rapide

1. **Démarrez Redis** : `redis-server`
2. **Lancez le backend** : `python app.py` (dans le dossier backend)
3. **Choisissez votre plateforme** :

#### Application Mobile
```bash
cd frontend
npm start
# Scannez le QR code avec Expo Go
```

#### Interface Web
1. Ouvrez `http://localhost:5000` dans votre navigateur
2. Entrez votre nom d'utilisateur et room
3. Cliquez sur "Rejoindre la Room"

### Conseils d'Utilisation

- **Rooms populaires** : `general`, `random`, `tech`
- **Cross-platform** : Les utilisateurs mobile et web peuvent chatter ensemble
- **Synchronisation** : Les messages apparaissent instantanément sur toutes les plateformes
- **Persistance** : L'historique est conservé pendant 7 jours

---

## Développement

### Scripts Disponibles

**Backend** :
```bash
python app.py                    # Serveur de développement
python app.py --production       # Mode production (si configuré)
```

**Frontend Mobile** :
```bash
npm start                        # Démarrer Expo
npm run android                  # Lancer sur Android
npm run ios                     # Lancer sur iOS
npm run web                     # Lancer sur navigateur (si configuré)
```

**Frontend Web** :
- Intégré au backend Flask
- Modification en live des templates HTML/CSS/JS
- Rechargement automatique du navigateur

### Variables d'Environnement

Créez un fichier `.env` dans `backend/` :
```ini
# Configuration Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Configuration Flask
FLASK_SECRET_KEY=votre_cle_secrete_ultra_securisee
SERVER_PORT=5000
DEBUG=True

# Configuration de rétention des données
MESSAGE_RETENTION_DAYS=7
USER_RETENTION_HOURS=2
ROOM_RETENTION_HOURS=24
```

### Configuration de la Rétention Redis

```python
# Configuration dans app.py
RETENTION_CONFIG = {
    'messages': 7 * 24 * 3600,      # 7 jours
    'users': 2 * 3600,              # 2 heures  
    'rooms': 24 * 3600,             # 1 jour
}
```

---

## Dépannage

| Problème | Solution |
|----------|----------|
| **Redis non accessible** | Vérifiez que Redis est démarré : `redis-cli ping` |
| **Erreur de connexion serveur** | Vérifiez l'IP dans `SocketService.ts` et le firewall |
| **App mobile ne démarre pas** | `rm -rf node_modules && npm install` |
| **Interface web ne charge pas** | Vérifiez que les templates sont dans `backend/templates/` |
| **Messages non synchronisés** | Redémarrez le serveur backend |
| **Redis plein** | Les données expirent automatiquement selon la configuration |

### Debug Avancé

**Vérifier Redis** :
```bash
redis-cli
> KEYS *                    # Voir toutes les clés
> LLEN room:general:messages # Nombre de messages
> TTL room:general:messages  # Temps d'expiration
```

**Logs Backend** :
- Tous les événements Socket.IO sont loggés
- Messages d'erreur Redis affichés dans la console
- API `/api/stats` pour monitoring en temps réel

---

## Fonctionnalités Avancées

### Monitoring en Temps Réel
```bash
# Statistiques des rooms
curl http://localhost:5000/api/stats

# Santé du serveur  
curl http://localhost:5000/api/health

# Rooms actives
curl http://localhost:5000/api/rooms
```

### Nettoyage Automatique
- **Tâche en arrière-plan** : Nettoie les rooms vides toutes les heures
- **Expiration Redis** : Données supprimées automatiquement
- **Optimisation mémoire** : Limitation à 100 messages par room

### Personnalisation
- **Couleurs d'avatars** : 7 couleurs générées par hash du nom d'utilisateur
- **Animations** : Transitions fluides sur mobile et web
- **Responsive** : Interface adaptée à tous les écrans

---

## Roadmap - Fonctionnalités Futures

### Version 2.0
- [ ] **Indicateurs de frappe** avancés (qui tape en temps réel)
- [ ] **Messages privés** entre utilisateurs
- [ ] **Réactions emoji** sur les messages
- [ ] **Partage de fichiers** (images, documents)

### Version 3.0
- [ ] **Authentification sécurisée** avec JWT
- [ ] **Profils utilisateurs** avec photos
- [ ] **Notifications push** natives
- [ ] **Thèmes personnalisables** (clair/sombre)
- [ ] **Modération automatique** des messages
- [ ] **API REST complète** pour intégrations tierces

### Version 4.0
- [ ] **Appels vocaux/vidéo** WebRTC
- [ ] **Partage d'écran** en temps réel
- [ ] **Bots intelligents** avec IA
- [ ] **Analytics avancées** des conversations
- [ ] **Clustering Redis** pour haute disponibilité

---

## Contribution

Les contributions sont chaleureusement accueillies ! Voici comment participer :

### Pour Commencer
1. **Forkez** le projet
2. **Clonez** votre fork : `git clone https://github.com/votre-username/chat_app.git`
3. **Créez** une branche : `git checkout -b feature/ma-super-fonctionnalite`
4. **Développez** votre fonctionnalité
5. **Testez** sur mobile ET web
6. **Commitez** : `git commit -m 'feat: Ajout de ma super fonctionnalité'`
7. **Pushez** : `git push origin feature/ma-super-fonctionnalite`
8. **Ouvrez** une Pull Request

### Guidelines de Contribution
- **Code Style** : Suivez les conventions existantes
- **Tests** : Testez sur les deux plateformes (mobile + web)
- **Documentation** : Mettez à jour le README si nécessaire
- **Commits** : Messages clairs et descriptifs

### Rapporter des Bugs
1. Vérifiez que le bug n'a pas déjà été reporté
2. Créez une issue avec :
   - **Environnement** : OS, versions, navigateur
   - **Étapes** pour reproduire
   - **Comportement attendu** vs **comportement observé**
   - **Screenshots** si applicable

---

## Conclusion

**TalkRooms Pro** représente l'avenir de la communication instantanée multi-plateforme. Avec son architecture robuste, son interface moderne et sa facilité d'utilisation, il offre une expérience de chat exceptionnelle sur mobile et web.

---

**Si ce projet vous plaît, n'hésitez pas à lui donner une étoile sur GitHub !**

*Construisons ensemble l'avenir de la communication instantanée* 🚀

---

**Made with ❤️ by [Kamouss Yassine] | © 2025 TalkRooms Pro**