import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import socketService from '../services/SocketService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Ionicons, 
  MaterialIcons, 
  Feather, 
  AntDesign,
  Foundation 
} from '@expo/vector-icons';

type ChatScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Chat'
>;

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface Props {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
}

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  type?: 'message' | 'notification';
}

const { width: screenWidth } = Dimensions.get('window');

// Composant séparé pour les messages avec hooks
const MessageItem: React.FC<{
  item: Message;
  index: number;
  username: string;
  getAvatarColor: (username: string) => string;
}> = ({ item, index, username, getAvatarColor }) => {
  const messageAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(messageAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);


  if (item.type === 'notification') {
    return (
      <Animated.View 
        style={[
          styles.notificationContainer,
          {
            opacity: messageAnim,
            transform: [{ scale: messageAnim }]
          }
        ]}
      >
        <Foundation name="crown" size={16} color="#FF6B6B" />
        <Text style={styles.notificationText}>{item.message}</Text>
        <MaterialIcons name="celebration" size={16} color="#FF6B6B" />
      </Animated.View>
    );
  }

  const isMyMessage = item.username === username;
  const time = new Date(item.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Animated.View
      style={[
        styles.messageWrapper,
        isMyMessage ? styles.myMessageWrapper : styles.otherMessageWrapper,
        {
          opacity: messageAnim,
          transform: [{ scale: messageAnim }]
        }
      ]}
    >
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessage : styles.otherMessage
      ]}>
        {!isMyMessage && (
          <View style={styles.avatarContainer}>
            <View style={[
              styles.avatar,
              { backgroundColor: getAvatarColor(item.username) }
            ]}>
              <Ionicons 
                name="person" 
                size={16} 
                color="#FFFFFF" 
              />
            </View>
          </View>
        )}
        
        <View style={styles.messageContent}>
          {!isMyMessage && (
            <View style={styles.senderHeader}>
              <Text style={styles.senderName}>{item.username}</Text>
              <Feather name="user" size={12} color="#666" />
            </View>
          )}
          
          <View style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
          ]}>
            <Text style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText
            ]}>
              {item.message}
            </Text>
          </View>
          
          <View style={[
            styles.messageFooter,
            isMyMessage ? styles.myMessageFooter : styles.otherMessageFooter
          ]}>
            <Ionicons 
              name="time-outline" 
              size={10} 
              color={isMyMessage ? "#4ECDC4" : "#999"} 
            />
            <Text style={[
              styles.messageTime,
              isMyMessage ? styles.myMessageTime : styles.otherMessageTime
            ]}>
              {time}
            </Text>
            {isMyMessage && (
              <AntDesign name="checkcircle" size={10} color="#4ECDC4" />
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { username, room } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(50);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(1);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animation d'entrée
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    // Écouter les nouveaux messages
    socketService.onNewMessage((message: Message) => {
      setMessages(prev => [...prev, { ...message, type: 'message' }]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    // Écouter les messages existants
    socketService.onRoomJoined((data) => {
      const formattedMessages = data.messages?.map((msg: any) => ({
        ...msg,
        type: 'message'
      })) || [];
      
      // Message de bienvenue avec icône
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        username: 'Système',
        message: `Bienvenue dans ${room}`,
        timestamp: new Date().toISOString(),
        type: 'notification'
      };
      
      setMessages([welcomeMessage, ...formattedMessages]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    });

    // Notifications avec icônes
    socketService.onUserJoined((data) => {
      const notificationMessage: Message = {
        id: 'join-' + Date.now(),
        username: 'Système',
        message: `${data.username} a rejoint la conversation`,
        timestamp: new Date().toISOString(),
        type: 'notification'
      };
      setMessages(prev => [...prev, notificationMessage]);
      setConnectedUsers(prev => prev + 1);
    });

    socketService.onUserLeft((data) => {
      const notificationMessage: Message = {
        id: 'leave-' + Date.now(),
        username: 'Système',
        message: `${data.username} a quitté la conversation`,
        timestamp: new Date().toISOString(),
        type: 'notification'
      };
      setMessages(prev => [...prev, notificationMessage]);
      setConnectedUsers(prev => Math.max(1, prev - 1));
    });

    socketService.onError((error) => {
      Alert.alert('Erreur', error.message);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      socketService.removeAllListeners();
    };
  }, [room]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socketService.sendMessage(newMessage.trim());
      setNewMessage('');
      setInputHeight(50);
      setIsTyping(false);
    }
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const maxHeight = 120;
    const minHeight = 50;
    setInputHeight(Math.min(Math.max(height + 20, minHeight), maxHeight));
  };

  const handleLeaveRoom = () => {
    Alert.alert(
      'Quitter la room',
      'Êtes-vous sûr de vouloir quitter cette conversation ?',
      [
        { 
          text: 'Annuler', 
          style: 'cancel',
          onPress: () => {}
        },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: () => {
            Keyboard.dismiss();
            socketService.disconnect();
            setTimeout(() => {
            navigation.goBack();
          }, 100);
          }
        }
      ],
      { 
        cancelable: true,
      }
    );
  };

  const getAvatarColor = (username: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const hash = username.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    return (
      <MessageItem 
        item={item}
        index={index}
        username={username}
        getAvatarColor={getAvatarColor}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      
      {/* Header avec icônes */}
      <Animated.View 
        style={[styles.header, { opacity: fadeAnim }]}
      >
        <View style={styles.headerLeft}>
          <View style={styles.roomInfo}>
            <MaterialIcons name="group" size={20} color="#FFFFFF" />
            <Text style={styles.roomName}>#{room}</Text>
            <View style={styles.onlineIndicator}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>{connectedUsers} en ligne</Text>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={16} color="#BDC3C7" />
            <Text style={styles.username}>{username}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.leaveButton}
          onPress={handleLeaveRoom}
        >
          <Ionicons name="exit-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Messages */}
      <Animated.View 
        style={[styles.messagesContainer, { opacity: fadeAnim }]}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={[
            styles.messagesContentContainer,
            { paddingBottom: keyboardHeight > 0 ? 20 : 100 }
          ]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }}
        />
      </Animated.View>

      {/* Input simplifié - TEXTE SEULEMENT */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Animated.View 
          style={[
            styles.inputContainer,
            { opacity: fadeAnim },
            Platform.OS === 'android' && keyboardHeight > 0 && {
              marginBottom: keyboardHeight
            }
          ]}
        >
          {isTyping && (
            <View style={styles.typingIndicator}>
              <MaterialIcons name="edit" size={14} color="#4ECDC4" />
              <Text style={styles.typingText}>Vous tapez...</Text>
            </View>
          )}
          
          <View style={styles.inputWrapper}>
            <View style={styles.inputArea}>
              <TextInput
                style={[
                  styles.textInput, 
                  { height: Math.max(50, inputHeight) },
                  isTyping && styles.textInputFocused
                ]}
                value={newMessage}
                onChangeText={(text) => {
                  setNewMessage(text);
                  setIsTyping(text.length > 0);
                }}
                placeholder="Tapez votre message..."
                placeholderTextColor="#BDC3C7"
                multiline
                maxLength={500}
                onContentSizeChange={handleContentSizeChange}
                onFocus={() => {
                  setIsTyping(true);
                  setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                  }, 300);
                }}
                onBlur={() => {
                  if (!newMessage.trim()) {
                    setIsTyping(false);
                  }
                }}
              />
            </View>
            
            <TouchableOpacity 
              style={[
                styles.sendButton,
                newMessage.trim() ? styles.sendButtonActive : styles.sendButtonInactive
              ]} 
              onPress={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingVertical: 15,
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerLeft: {
    flex: 1,
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
    marginRight: 12,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#27AE60',
    marginRight: 4,
  },
  onlineText: {
    fontSize: 10,
    color: '#BDC3C7',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 12,
    color: '#BDC3C7',
    marginLeft: 4,
  },
  leaveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  messageWrapper: {
    marginVertical: 4,
  },
  myMessageWrapper: {
    alignItems: 'flex-end',
  },
  otherMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageContainer: {
    flexDirection: 'row',
    maxWidth: '85%',
    alignItems: 'flex-end',
  },
  myMessage: {
    flexDirection: 'row-reverse',
  },
  otherMessage: {
    flexDirection: 'row',
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContent: {
    flex: 1,
  },
  senderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginLeft: 12,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginRight: 4,
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  myMessageBubble: {
    backgroundColor: '#3498DB',
    borderBottomRightRadius: 6,
  },
  otherMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#2C3E50',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginHorizontal: 12,
  },
  myMessageFooter: {
    justifyContent: 'flex-end',
  },
  otherMessageFooter: {
    justifyContent: 'flex-start',
  },
  messageTime: {
    fontSize: 10,
    marginHorizontal: 4,
  },
  myMessageTime: {
    color: '#4ECDC4',
  },
  otherMessageTime: {
    color: '#95A5A6',
  },
  notificationContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 12,
    color: '#E74C3C',
    marginHorizontal: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  typingText: {
    fontSize: 12,
    color: '#4ECDC4',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    marginRight: 12,
  },
  textInput: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    maxHeight: 120,
  },
  textInputFocused: {
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  sendButtonInactive: {
    backgroundColor: '#BDC3C7',
  },
});

export default ChatScreen;