import React, { useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PremiumHeader } from '../../../shared/components/PremiumScaffold';
import { premiumColors, premiumShadow, premiumSpacing } from '../../../shared/theme/premiumTheme';

const categories = ['All', 'Haircut', 'Beard', 'Facial'];
const initialServices = [
  { id: '1', name: 'Classic Haircut', price: 250, description: 'Clean shaping with premium finishing.', category: 'Haircut', tag: 'Popular' },
  { id: '2', name: 'Beard Trim', price: 150, description: 'Line-up, shape, and beard conditioning.', category: 'Beard', tag: 'Trending' },
  { id: '3', name: 'Facial Cleanse', price: 400, description: 'Deep cleanse with skin preparation.', category: 'Facial', tag: 'Premium' },
];

const Services = () => {
  const [services, setServices] = useState(initialServices);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', description: '', category: 'Haircut' });

  const filtered = useMemo(() => services.filter(service =>
    (category === 'All' || service.category === category) &&
    service.name.toLowerCase().includes(search.toLowerCase()),
  ), [category, search, services]);

  const saveService = () => {
    if (!form.name.trim() || !form.price.trim()) return;
    setServices(prev => [{ ...form, id: Date.now().toString(), price: Number(form.price), tag: 'New' }, ...prev]);
    setForm({ name: '', price: '', description: '', category: 'Haircut' });
    setModalOpen(false);
  };

  return (
    <View style={styles.screen}>
      <PremiumHeader
        eyebrow="Catalog"
        title="Services"
        subtitle="Keep your menu clear, priced, and ready to book."
        right={
          <TouchableOpacity style={styles.addCircle} onPress={() => setModalOpen(true)}>
            <Icon name="plus" size={18} color={premiumColors.surface} />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchBox}>
        <Icon name="search" size={16} color={premiumColors.muted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search services"
          placeholderTextColor={premiumColors.muted}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.categoryRow}>
        {categories.map(item => (
          <TouchableOpacity key={item} style={[styles.categoryPill, category === item && styles.categoryPillActive]} onPress={() => setCategory(item)}>
            <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconBox}>
              <Icon name="scissors" size={20} color={premiumColors.primary} />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
              </View>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.softPill}><Text style={styles.softPillText}>{item.category}</Text></View>
                <View style={styles.mintPill}><Text style={styles.mintPillText}>{item.tag}</Text></View>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No services match your search.</Text>}
      />

      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Add Service</Text>
            <TextInput placeholder="Service name" placeholderTextColor={premiumColors.muted} style={styles.input} value={form.name} onChangeText={name => setForm(prev => ({ ...prev, name }))} />
            <TextInput placeholder="Price" placeholderTextColor={premiumColors.muted} style={styles.input} keyboardType="numeric" value={form.price} onChangeText={price => setForm(prev => ({ ...prev, price: price.replace(/[^0-9]/g, '') }))} />
            <TextInput placeholder="Description" placeholderTextColor={premiumColors.muted} style={styles.input} value={form.description} onChangeText={description => setForm(prev => ({ ...prev, description }))} />
            <View style={styles.categoryRowCompact}>
              {categories.filter(item => item !== 'All').map(item => (
                <TouchableOpacity key={item} style={[styles.categoryPill, form.category === item && styles.categoryPillActive]} onPress={() => setForm(prev => ({ ...prev, category: item }))}>
                  <Text style={[styles.categoryText, form.category === item && styles.categoryTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={saveService}>
              <Text style={styles.primaryButtonText}>Save Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: premiumColors.canvas },
  addCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: premiumColors.primary, alignItems: 'center', justifyContent: 'center', ...premiumShadow },
  searchBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: premiumSpacing.screen, backgroundColor: premiumColors.surface, borderRadius: 16, borderWidth: 1, borderColor: premiumColors.line, paddingHorizontal: 14 },
  searchInput: { flex: 1, color: premiumColors.ink, fontSize: 15, paddingVertical: 12, marginLeft: 8 },
  categoryRow: { flexDirection: 'row', paddingHorizontal: premiumSpacing.screen, gap: 8, marginTop: 14, marginBottom: 8 },
  categoryRowCompact: { flexDirection: 'row', gap: 8, marginTop: 4, marginBottom: 12 },
  categoryPill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, backgroundColor: premiumColors.surface, borderWidth: 1, borderColor: premiumColors.line },
  categoryPillActive: { backgroundColor: premiumColors.primary, borderColor: premiumColors.primary },
  categoryText: { color: premiumColors.muted, fontWeight: '800', fontSize: 13 },
  categoryTextActive: { color: premiumColors.surface },
  list: { padding: premiumSpacing.screen, paddingTop: 6, paddingBottom: 112 },
  card: { flexDirection: 'row', backgroundColor: premiumColors.surface, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: premiumColors.line, ...premiumShadow },
  iconBox: { width: 46, height: 46, borderRadius: 16, backgroundColor: premiumColors.softPrimary, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1, marginLeft: 13 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { flex: 1, color: premiumColors.ink, fontSize: 16, fontWeight: '900', paddingRight: 8 },
  price: { color: premiumColors.primary, fontSize: 17, fontWeight: '900' },
  description: { color: premiumColors.muted, fontSize: 13, marginTop: 6, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', gap: 8, marginTop: 12 },
  softPill: { backgroundColor: premiumColors.softPrimary, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 5 },
  softPillText: { color: premiumColors.primary, fontWeight: '900', fontSize: 11 },
  mintPill: { backgroundColor: premiumColors.softSecondary, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 5 },
  mintPillText: { color: premiumColors.secondary, fontWeight: '900', fontSize: 11 },
  empty: { color: premiumColors.muted, textAlign: 'center', marginTop: 40, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(32,35,42,0.35)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: premiumColors.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 22 },
  sheetHandle: { width: 44, height: 5, borderRadius: 3, backgroundColor: premiumColors.line, alignSelf: 'center', marginBottom: 18 },
  sheetTitle: { color: premiumColors.ink, fontSize: 22, fontWeight: '900', marginBottom: 16 },
  input: { backgroundColor: premiumColors.canvas, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: premiumColors.ink, marginBottom: 10, borderWidth: 1, borderColor: premiumColors.line },
  primaryButton: { backgroundColor: premiumColors.primary, borderRadius: 16, alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  primaryButtonText: { color: premiumColors.surface, fontSize: 16, fontWeight: '900' },
});

export default Services;
