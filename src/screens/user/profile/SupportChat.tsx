import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { usePremiumTheme, premiumSpacing, premiumShadow } from '../../../shared/theme/premiumTheme';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

const SupportChat = () => {
  const { colors } = usePremiumTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  // Messages State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'agent',
      text: 'Hello Rahul 😊\nHow can we help you today?',
      time: '09:41 AM'
    },
    {
      id: '2',
      sender: 'user',
      text: 'I want to know about cancellation policy.',
      time: '09:42 AM'
    },
    {
      id: '3',
      sender: 'agent',
      text: 'You can cancel your booking up to 2 hours before the appointment time to avoid cancellation policy.',
      time: '09:43 AM'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  const getFormatTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: inputText,
      time: getFormatTime()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate Agent response
    setTimeout(() => {
      setIsTyping(false);
      let responseText = "Thank you for reaching out! A support representative will join this chat shortly. Feel free to explore our FAQs in the meantime.";
      
      const lowerText = inputText.toLowerCase();
      if (lowerText.includes('cancel') || lowerText.includes('policy')) {
        responseText = "Under our standard policy, cancellations are fully free if performed up to 2 hours before the service. You can do this easily in 'My Bookings'.";
      } else if (lowerText.includes('refund') || lowerText.includes('money') || lowerText.includes('pay')) {
        responseText = "For online transactions, refunds are initiated immediately upon cancellation and credited back to your bank account within 3 to 5 business days.";
      } else if (lowerText.includes('coupon') || lowerText.includes('discount') || lowerText.includes('promo')) {
        responseText = "You have awesome active discounts under the 'My Coupons' screen! Copy the coupon code and apply it directly on booking checkout!";
      } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
        responseText = "Hello! Hope you are having a wonderful day. How can I assist you with your appointment bookings?";
      }

      const agentMsg: Message = {
        id: Math.random().toString(),
        sender: 'agent',
        text: responseText,
        time: getFormatTime()
      };

      setMessages(prev => [...prev, agentMsg]);
    }, 1800);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.canvas }]}
    >
      <Header title="Support Chat" showBack rightElement={
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="ellipsis-vertical" size={20} color="ink" />
        </TouchableOpacity>
      } />

      {/* Message List */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.chatScroll}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isUser ? styles.userRow : styles.agentRow
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isUser
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.surface }
                ]}
              >
                <Typography
                  variant="caption"
                  style={{ color: isUser ? colors.surface : colors.ink, lineHeight: 20 }}
                >
                  {msg.text}
                </Typography>
              </View>
              <Typography variant="label" color="muted" style={styles.timeText}>
                {msg.time}
              </Typography>
            </View>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <View style={[styles.messageRow, styles.agentRow]}>
            <View style={[styles.messageBubble, styles.typingBubble, { backgroundColor: colors.surface }]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Typography variant="label" color="muted" style={styles.typingText}>
                Support is typing...
              </Typography>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Text Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.line }]}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          style={[styles.textInput, { color: colors.ink }]}
          placeholder="Type your message..."
          placeholderTextColor={colors.muted}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
        >
          <Icon name="send" size={16} color="surface" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  moreButton: { padding: 4 },
  chatScroll: { padding: 16, paddingBottom: 24, gap: 16 },
  messageRow: {
    maxWidth: '80%',
    gap: 4,
  },
  userRow: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  agentRow: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: '#20232A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  timeText: {
    fontSize: 10,
    marginTop: 2,
    marginHorizontal: 4,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 11,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default SupportChat;
