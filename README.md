# ChatApp Pro - Votre Hub de Communication en Temps Réel 

Bienvenue sur **ChatApp Pro**, une application de chat moderne, interactive et ultra-rapide conçue pour connecter les gens à travers des salles de discussion thématiques (_rooms_) en **temps réel**. Plongez dans des conversations fluides et dynamiques !

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-%23000020.svg?style=for-the-badge&logo=expo&logoColor=%23fff)](https://expo.dev/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=%23fff)](https://flask.palletsprojects.com/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)

---

## Aperçu

ChatApp Pro réinvente la communication instantanée :

-  **Rejoignez des Rooms:** Connectez-vous facilement avec un pseudo et un ID de salle.
-  **Messagerie Instantanée:** Échangez des messages qui apparaissent comme par magie.
-   👀 **Qui est en Ligne ?** Visualisez la liste des participants actifs.
-  **Notifications Intelligentes:** Soyez alerté des arrivées et départs, sans être submergé.

---

## Architecture Robuste

ChatApp Pro s'appuie sur des technologies de pointe pour une expérience optimale :

### Backend (Python / Flask)

-   **Framework Puissant** : Flask & Flask-SocketIO pour une gestion temps réel performante.
-   **Base de Données Ultra-Rapide** : Redis pour la persistance des messages et la gestion des états.
-   **Communication Magique** : WebSockets pour des échanges instantanés.

### Frontend (React Native / Expo)

-   **Expérience Native** : React Native & Expo pour une application mobile cross-platform fluide.
-   **Navigation Intuitive** : React Navigation v7 pour des transitions élégantes.
-   **Client WebSocket Efficace** : Socket.IO Client pour une connexion stable avec le backend.
-   **UI Moderne & Animée** : Une interface utilisateur soignée avec des animations subtiles pour le plaisir des yeux.

---

## Fonctionnalités Clés

### Authentification Simplifiée
- Connexion rapide via nom d’utilisateur et ID de room.
- Validation des champs pour éviter les erreurs.

### Chat en Temps Réel
- Messages instantanés avec confirmation visuelle.
- Horodatage précis pour chaque message.
- Avatars Colorés Uniques générés dynamiquement.

### Interface Utilisateur Soignée
- Design moderne, épuré et responsive.
- Animations fluides pour une expérience utilisateur agréable.
- Mode Sombre pour l'En-tête.
- Indicateurs d'état clairs.

### Notifications Système
- Messages de bienvenue personnalisés.
- Notifications d'arrivée et de départ des utilisateurs.
- Compteur d'utilisateurs connectés en temps réel.

### Persistance des Données Intelligente
- Historique des messages sauvegardé via Redis.
- Récupération automatique de l'historique à la reconnexion.
- Limité aux 100 derniers messages par room pour optimiser les performances.

---

##  Installation et Configuration

Préparez-vous à chatter en quelques étapes !

### Prérequis

#### Backend
- Python 3.8+
- Redis Server
- pip (gestionnaire de paquets Python)

#### Frontend
- Node.js 16+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Un smartphone avec l'application Expo Go ou un émulateur Android/iOS.

---

### Backend Setup

1.  **Clonez le dépôt :**
    ```bash
    git clone <votre-repository-url>
    cd chat_app/backend
    ```

2.  **Installez les dépendances Python :**
    Créez un environnement virtuel (recommandé) :
    ```bash
    python -m venv venv
    source venv/bin/activate  # Sur Windows: venv\Scripts\activate
    ```
    Puis installez les paquets :
    ```bash
    pip install -r requirements.txt
    # Ou si requirements.txt n'existe pas encore:
    # pip install flask flask-socketio flask-cors redis python-dotenv
    ```

3.  **Démarrez Redis :**
    *   **Ubuntu/Debian:** `sudo service redis-server start`
    *   **macOS (Homebrew):** `brew services start redis`
    *   **Windows (via Docker or WSL):** `docker run -d -p 6379:6379 redis:alpine`
    *   Vérifiez : `redis-cli ping` (doit retourner `PONG`)

4.  **Configurez les variables d'environnement :**
    Créez un fichier `.env` à la racine de `backend/` (voir `backend/.env.example` s'il existe) :
    ```ini
    # backend/.env
    REDIS_HOST=localhost
    REDIS_PORT=6379
    FLASK_APP=app.py # ou le nom de votre fichier principal Flask
    FLASK_DEBUG=True # Mettre à False en production
    SERVER_PORT=5000
    FLASK_SECRET_KEY=votre_super_cle_secrete_ici
    ```

5.  **Démarrez le serveur Flask :**
    ```bash
    python app.py 
    # Ou si vous utilisez FLASK_APP dans .env : flask run
    ```
    Le serveur sera en écoute sur `http://0.0.0.0:5000`.

---

### Frontend Setup

1.  **Naviguez vers le dossier frontend :**
    ```bash
    cd ../frontend 
    # Assurez-vous d'être dans le bon dossier frontend
    ```

2.  **Installez les dépendances Node.js :**
    ```bash
    npm install
    # ou
    # yarn install
    ```

3.  **Configurez l'URL du serveur Backend :**
    Ouvrez `frontend/src/services/SocketService.ts` (ou le fichier équivalent) et modifiez :
    ```typescript
    // frontend/src/services/SocketService.ts
    private readonly serverUrl = 'http://VOTRE_IP_LOCALE_BACKEND:5000';
    // Remplacez VOTRE_IP_LOCALE_BACKEND par l'adresse IP de la machine hébergeant le backend.
    // (ex: 192.168.1.XX). N'utilisez PAS localhost ou 127.0.0.1 si vous testez sur un appareil mobile physique.
    ```

4.  **Démarrez l'application Expo :**
    ```bash
    npm start
    # ou
    # yarn start
    ```
    Scannez le QR Code avec Expo Go ou lancez sur un émulateur.

---

##  API & Communication (WebSockets)

### Événements Émis (Client → Serveur)
- `join_room` ({ `username`: string, `roomId`: string, `avatarColor`: string })
- `send_message` ({ `message`: string, `username`: string, `roomId`: string, `avatarColor`: string })
- `disconnect` (géré automatiquement par Socket.IO)

### Événements Reçus (Serveur → Client)
- `connected` ({ `message`: string })
- `room_joined` ({ `roomId`: string, `username`: string, `messages`: Message[], `users`: string[] })
- `new_message` (message: Message)
- `user_joined` ({ `username`: string, `users`: string[], `avatarColor`: string })
- `user_left` ({ `username`: string, `users`: string[] })
- `error` ({ `message`: string })

### Structure d'un Message
```typescript
interface Message {
  id: string;
  userId: string; // Peut être le username pour la simplicité
  username: string;
  message: string;
  timestamp: string; // ISO 8601 Date string
  roomId: string;
  type?: 'message' | 'notification' | 'system';
  avatarColor?: string;
}
```

## Structure du Projet
```bash
chat_app/
├── backend/
│   ├── .env             # Variables d'environnement (NON versionné)
│   ├── app.py           # Logique du serveur Flask & SocketIO
│   └── requirements.txt # Dépendances Python (générez-le avec pip freeze > requirements.txt)
├── frontend/
│   ├── App.tsx          # Point d'entrée principal React Native
│   ├── app.json         # Configuration Expo
│   ├── package.json     # Dépendances et scripts NPM
│   ├── tsconfig.json    # Configuration TypeScript
│   └── src/
│       ├── components/      # Composants UI réutilisables
│       ├── navigation/      # Configuration React Navigation
│       ├── screens/         # Écrans de l'application
│       ├── services/        # Logique métier et communication (SocketService)
│       ├── types/           # Définitions TypeScript
│       └── utils/           # Fonctions utilitaires
└── README.md
```

## Utilisation
1. Assurez-vous que Redis est en cours d'exécution.
2. Démarrez le serveur backend (python app.py dans le dossier backend).
3. Lancez l'application mobile frontend (npm start dans le dossier frontend).
4. Sur l'écran de connexion :
    - Entrez un Nom d’utilisateur.
    - Entrez un ID de la Room.
5. Appuyez sur "Rejoindre" et commencez à discuter !

## Développement & Scripts
### Backend
```bash
# (Dans le dossier backend/)
# Activer l'environnement virtuel si vous en utilisez un
# source venv/bin/activate
python app.py
```

### Frontend
```bash
# (Dans le dossier frontend/)
npm start        # Démarre le Metro Bundler d'Expo
npm run android  # Lance l'app sur un émulateur/appareil Android
npm run ios      # Lance l'app sur un émulateur/appareil iOS
# npm run web    # (Si configuré pour le web)
```

## Pistes d'Amélioration & Fonctionnalités Futures (Roadmap)
- Indicateurs de frappe ("User is typing...")
- Messages privés
- Partage de fichiers/images
- Réactions Emoji
- Thèmes personnalisables (clair/sombre global)
- Authentification avancée
- Notifications Push natives

## Dépannage
| Problème                       | Solution                                                              |
| ------------------------------ | --------------------------------------------------------------------- |
| Connexion Redis impossible     | Assurez-vous que Redis est démarré (`redis-cli ping`)                 |
| Erreur de connexion au serveur | Vérifiez l’IP dans `SocketService.ts`, lancez le backend, firewall ok |
| App ne démarre pas             | Vérifiez Node/npm, supprimez `node_modules`, puis `npm install`       |

## Contribution
Les contributions sont les bienvenues !
- Forkez le projet.
- Créez votre branche de fonctionnalité (git checkout -b feature/MaSuperFonctionnalite).
- Commitez vos changements (git commit -m 'Ajout: MaSuperFonctionnalite').
- Poussez vers la branche (git push origin feature/MaSuperFonctionnalite).
- Ouvrez une Pull Request.