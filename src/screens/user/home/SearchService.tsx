import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { Header } from '../../../shared/components/Header';
import { Icon } from '../../../shared/components/Icon';
import { usePremiumTheme, premiumSpacing, premiumShadow } from '../../../shared/theme/premiumTheme';
import { useNavigation } from '@react-navigation/native';

interface Service {
  id: string;
  title: string;
  duration: string;
  price: string;
  iconName: string;
}

const SearchService = () => {
  const { colors } = usePremiumTheme();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');

  const services: Service[] = [
    { id: '1', title: 'Haircut', duration: '30 mins', price: '₹299', iconName: 'cut-outline' },
    { id: '2', title: 'Beard Trim', duration: '20 mins', price: '₹199', iconName: 'person-outline' },
    { id: '3', title: 'Shave', duration: '15 mins', price: '₹149', iconName: 'water-outline' },
    { id: '4', title: 'Hair Spa', duration: '45 mins', price: '₹499', iconName: 'color-wand-outline' },
    { id: '5', title: 'Hair Color', duration: '60 mins', price: '₹999', iconName: 'color-palette-outline' },
  ];

  const getFilteredServices = () => {
    return services.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]}>
      <Header title="Search Service" showBack />

      {/* Custom Search Input Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Icon name="search" size={20} color="muted" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search services..."
            placeholderTextColor={colors.muted}
            style={[styles.textInput, { color: colors.ink }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Icon name="close-circle" size={18} color="muted" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Services List Scroll Area */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.listCard, { backgroundColor: colors.surface }, premiumShadow]}>
          {getFilteredServices().map((service, index) => (
            <TouchableOpacity
              key={service.id}
              onPress={() => navigation.navigate('ServiceDetails', { service })}
              style={[
                styles.serviceRow,
                { borderBottomColor: colors.line, borderBottomWidth: index === getFilteredServices().length - 1 ? 0 : 1 }
              ]}
            >
              <View style={[styles.iconWrapper, { backgroundColor: colors.canvas }]}>
                <Icon name={service.iconName} size={22} color="ink" />
              </View>
              <View style={styles.serviceInfo}>
                <Typography variant="body" weight="bold">{service.title}</Typography>
                <Typography variant="caption" color="muted">{service.duration} • {service.price}</Typography>
              </View>
              <Icon name="chevron-forward" size={18} color="muted" />
            </TouchableOpacity>
          ))}

          {getFilteredServices().length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="search-outline" size={36} color="muted" />
              <Typography variant="body" color="muted">No services match your search.</Typography>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
  },
  clearBtn: { padding: 4 },
  scrollContent: { padding: 16, paddingTop: 4 },
  listCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  serviceRow: {
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
  serviceInfo: { flex: 1 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 10,
  },
});

export default SearchService;
