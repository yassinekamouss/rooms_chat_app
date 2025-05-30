import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import { 
  Ionicons, 
  MaterialIcons, 
  Feather,
  AntDesign 
} from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import socketService from '../services/SocketService';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Animation d'entrée
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleJoinRoom = async () => {
    if (!username.trim() || !room.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    try {
      await socketService.connect();
      
      socketService.onRoomJoined((data) => {
        setLoading(false);
        navigation.navigate('Chat', { username, room });
      });

      socketService.onError((error) => {
        setLoading(false);
        Alert.alert('Erreur', error.message);
      });

      socketService.joinRoom(username, room);
    } catch (error) {
      setLoading(false);
      Alert.alert('Erreur de connexion', 'Impossible de se connecter au serveur');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      
      {/* Header décoratif */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.headerContent}>
          <MaterialIcons name="chat-bubble" size={40} color="#FFFFFF" />
          <Text style={styles.headerTitle}>ChatApp</Text>
          <Text style={styles.headerSubtitle}>Connectez-vous instantanément</Text>
        </View>
        
        {/* Cercles décoratifs */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </Animated.View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Icône principale */}
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Ionicons name="chatbubbles" size={50} color="#2C3E50" />
              </View>
            </View>

            <Text style={styles.title}>Rejoindre une Room</Text>
            <Text style={styles.subtitle}>Entrez vos informations pour commencer</Text>
            
            {/* Input Nom d'utilisateur */}
            <View style={styles.inputContainer}>
              <View style={styles.inputLabel}>
                <Feather name="user" size={16} color="#2C3E50" />
                <Text style={styles.label}>Nom d'utilisateur</Text>
              </View>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'username' && styles.inputWrapperFocused
              ]}>
                <Ionicons name="person-outline" size={20} color="#BDC3C7" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Entrez votre nom"
                  placeholderTextColor="#BDC3C7"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                />
                {username.length > 0 && (
                  <AntDesign name="checkcircle" size={16} color="#4ECDC4" />
                )}
              </View>
            </View>

            {/* Input Room ID */}
            <View style={styles.inputContainer}>
              <View style={styles.inputLabel}>
                <MaterialIcons name="meeting-room" size={16} color="#2C3E50" />
                <Text style={styles.label}>ID de la Room</Text>
              </View>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'room' && styles.inputWrapperFocused
              ]}>
                <MaterialIcons name="tag" size={20} color="#BDC3C7" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={room}
                  onChangeText={setRoom}
                  placeholder="Entrez l'ID de la room"
                  placeholderTextColor="#BDC3C7"
                  autoCapitalize="none"
                  returnKeyType="go"
                  onSubmitEditing={handleJoinRoom}
                  onFocus={() => setFocusedInput('room')}
                  onBlur={() => setFocusedInput(null)}
                />
                {room.length > 0 && (
                  <AntDesign name="checkcircle" size={16} color="#4ECDC4" />
                )}
              </View>
            </View>

            {/* Bouton de connexion */}
            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.buttonDisabled,
                (username.trim() && room.trim()) && styles.buttonReady
              ]}
              onPress={handleJoinRoom}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.loadingText}>Connexion...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Rejoindre la Room</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>

            {/* Info footer */}
            <View style={styles.footerInfo}>
              <MaterialIcons name="info-outline" size={16} color="#95A5A6" />
              <Text style={styles.footerText}>
                Connectez-vous en temps réel avec d'autres utilisateurs
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  header: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BDC3C7',
    marginTop: 4,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    top: -20,
    right: -30,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -50,
    left: -40,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECF0F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: '#95A5A6',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    color: '#2C3E50',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
  },
  inputWrapperFocused: {
    borderColor: '#4ECDC4',
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2C3E50',
  },
  suggestionsContainer: {
    marginBottom: 24,
  },
  suggestionsTitle: {
    fontSize: 12,
    color: '#95A5A6',
    marginBottom: 8,
  },
  suggestionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionButton: {
    backgroundColor: '#ECF0F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 12,
    color: '#2C3E50',
  },
  button: {
    backgroundColor: '#BDC3C7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonReady: {
    backgroundColor: '#4ECDC4',
  },
  buttonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#95A5A6',
    marginLeft: 6,
    textAlign: 'center',
  },
});

export default LoginScreen;