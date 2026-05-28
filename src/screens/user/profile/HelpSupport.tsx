import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { Button } from '../../../shared/components/Button';
import { usePremiumTheme, premiumSpacing, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useNavigation } from '@react-navigation/native';

const HelpSupport = () => {
  const { colors } = usePremiumTheme();
  const navigation = useNavigation<any>();

  const helpTopics = [
    { id: '1', title: 'FAQs', icon: 'help-circle-outline', desc: 'Find answers to common questions' },
    { id: '2', title: 'How to Book', icon: 'book-outline', desc: 'Step by step booking guide' },
    { id: '3', title: 'Payments', icon: 'card-outline', desc: 'Payment related help' },
    { id: '4', title: 'Cancellation Policy', icon: 'alert-circle-outline', desc: 'Learn about our policy' },
    { id: '5', title: 'Contact Support', icon: 'people-outline', desc: 'Talk to our support team' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header title="Help & Support" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Typography variant="h4" weight="bold" style={styles.sectionTitle}>Quick Help</Typography>

        {/* List of help topics */}
        <View style={[styles.topicsCard, { backgroundColor: colors.surface }, premiumShadow]}>
          {helpTopics.map((topic, index) => (
            <TouchableOpacity
              key={topic.id}
              onPress={() => {
                if (topic.title === 'Contact Support') {
                  navigation.navigate('SupportChat');
                } else {
                  Alert.alert(topic.title, `Display details about ${topic.title} (Simulation).`);
                }
              }}
              style={[
                styles.topicRow,
                { borderBottomColor: colors.line, borderBottomWidth: index === helpTopics.length - 1 ? 0 : 1 }
              ]}
            >
              <View style={[styles.iconWrapper, { backgroundColor: colors.canvas }]}>
                <Icon name={topic.icon} size={22} color="ink" />
              </View>
              <View style={styles.topicInfo}>
                <Typography variant="body" weight="bold">{topic.title}</Typography>
                <Typography variant="caption" color="muted">{topic.desc}</Typography>
              </View>
              <Icon name="chevron-forward" size={18} color="muted" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact/Support call to action */}
        <View style={styles.ctaContainer}>
          <Typography variant="h4" weight="bold" style={styles.ctaTitle}>Still need help?</Typography>
          <Typography variant="caption" color="muted" style={styles.ctaSubtitle}>
            Our support team is here for you.
          </Typography>
        </View>
      </ScrollView>

      {/* Footer Chat Action Button */}
      <View style={[styles.footer, { backgroundColor: colors.canvas }]}>
        <Button
          title="Chat with Us"
          size="large"
          icon={<Icon name="chatbubble-ellipses-outline" size={20} color="surface" />}
          onPress={() => navigation.navigate('SupportChat')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  sectionTitle: { marginBottom: 16 },
  topicsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  topicInfo: {
    flex: 1,
  },
  ctaContainer: {
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTitle: {
    marginBottom: 6,
  },
  ctaSubtitle: {
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
  },
});

export default HelpSupport;
