import React, { useState, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { usePremiumTheme, premiumShadow } from '../../../shared/theme/premiumTheme';

type Message = {
  id: string;
  text: string;
  sender: 'support' | 'user';
  time: string;
};

const BarberChatSupport = () => {
  const { colors, mode } = usePremiumTheme();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  const purpleTheme = {
    primary: '#6D4CF3',
    activeBg: mode === 'dark' ? '#3A281E' : '#F5F1ED',
  };

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can we help you?', sender: 'support', time: '10:00 AM' },
    { id: '2', text: 'I need help with a booking.', sender: 'user', time: '10:01 AM' },
    { id: '3', text: 'Sure, please share your booking ID.', sender: 'support', time: '10:02 AM' },
  ]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Scroll to end
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    // Simulate auto-reply after 1 second
    setTimeout(() => {
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for sharing. Let me look up those booking details for you. One moment, please!',
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, replyMsg]);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.line }]}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={18} color={colors.ink} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.ink }]}>Chat Support</Text>

          <View style={{ width: 36 }} />
        </View>

        {/* Message Log Panel */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatScroll}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(item => {
            const isUser = item.sender === 'user';
            return (
              <View
                key={item.id}
                style={[
                  styles.msgRow,
                  isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }
                ]}
              >
                {/* Bubble Container */}
                <View style={[
                  styles.bubble,
                  isUser
                    ? [styles.userBubble, { backgroundColor: purpleTheme.primary }]
                    : [styles.supportBubble, { backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1 }]
                ]}>
                  <Text style={[
                    styles.bubbleText,
                    isUser ? { color: '#FFFFFF' } : { color: colors.ink }
                  ]}>
                    {item.text}
                  </Text>
                  <Text style={[
                    styles.timeText,
                    isUser ? { color: 'rgba(255,255,255,0.7)' } : { color: colors.muted }
                  ]}>
                    {item.time}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Composer Bar */}
        <View style={[styles.composerContainer, { backgroundColor: colors.surface, borderTopColor: colors.line }]}>
          <TextInput
            placeholder="Type your message..."
            placeholderTextColor={colors.muted}
            value={inputText}
            onChangeText={setInputText}
            style={[styles.composerInput, { color: colors.ink }]}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={[styles.sendBtn, { backgroundColor: purpleTheme.primary }]}
          >
            <Icon name="send" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  chatScroll: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 14,
  },
  msgRow: {
    flexDirection: 'row',
    width: '100%',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...premiumShadow,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  supportBubble: {
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 9.5,
    marginTop: 4,
    textAlign: 'right',
  },
  composerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  composerInput: {
    flex: 1,
    fontSize: 14.5,
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default BarberChatSupport;
