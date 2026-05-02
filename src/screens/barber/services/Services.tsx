
import React, { useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Image, Alert, Animated, Keyboard, Platform, Easing
} from 'react-native';
const CATEGORIES = ['Haircut', 'Beard', 'Facial'];
// ...existing code...
const BADGES = ['Popular', 'Trending'];
const DUMMY_SERVICES = [
  {
    id: '1',
    name: 'Classic Haircut',
    price: 250,
    description: 'A classic haircut for all hair types.',
    category: 'Haircut',
    badge: 'Popular',
    image: null,
  },
  {
    id: '2',
    name: 'Beard Trim',
    price: 150,
    description: 'Professional beard trimming and shaping.',
    category: 'Beard',
    badge: 'Trending',
    image: null,
  },
  {
    id: '3',
    name: 'Facial Cleanse',
    price: 400,
    description: 'Deep cleansing facial for glowing skin.',
    category: 'Facial',
    badge: null,
    image: null,
  },
];

function randomId() {
  return Math.random().toString(36).substr(2, 9);
}

const Services = () => {
  const [services, setServices] = useState(DUMMY_SERVICES);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    category: CATEGORIES[0],
    badge: '',
    image: null,
  });
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOption, setSortOption] = useState('Default');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [validation, setValidation] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [swipedId, setSwipedId] = useState(null);
  const swipeAnim = useRef({}).current;

  // Toast feedback
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 1800);
  };

  // Modal open/close helpers
  const openAddModal = () => {
    setEditMode(false);
    setForm({ id: '', name: '', price: '', description: '', category: CATEGORIES[0], badge: '', image: null });
    setValidation({});
    setModalVisible(true);
  };
  const openEditModal = (service) => {
    setEditMode(true);
    setForm({ ...service, price: service.price.toString() });
    setValidation({});
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setValidation({});
  };

  // Add or update service
  const handleSubmit = () => {
    let errors = {};
    if (!form.name.trim()) errors.name = 'Service name required';
    if (!form.price || isNaN(Number(form.price))) errors.price = 'Price must be a number';
    if (!form.description.trim()) errors.description = 'Description required';
    setValidation(errors);
    if (Object.keys(errors).length > 0) return;

    if (editMode) {
      setServices(services.map(s => s.id === form.id ? { ...form, price: Number(form.price) } : s));
      showToast('✏️ Service Updated', 'success');
    } else {
      setServices([{ ...form, id: randomId(), price: Number(form.price) }, ...services]);
      showToast('✅ Service Added', 'success');
    }
    closeModal();
  };

  // Delete service
  const handleDelete = (id) => {
    setServices(services.filter(s => s.id !== id));
    showToast('❌ Service Deleted', 'error');
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  // Swipe actions
  const handleSwipe = (id, direction) => {
    setSwipedId(id);
    if (direction === 'left') setShowDeleteConfirm(true);
    if (direction === 'right') {
      const service = services.find(s => s.id === id);
      openEditModal(service);
    }
  };

  // Filter, sort, search
  let filtered = services.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase())) &&
    (filterCategory === 'All' || s.category === filterCategory)
  );
  if (sortOption === 'PriceLowHigh') filtered = filtered.sort((a, b) => a.price - b.price);

  // Empty state
  const isEmpty = filtered.length === 0;

  // Render service card
  const renderService = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.swipeArea}
        onLongPress={() => handleSwipe(item.id, 'left')}
        onPress={() => handleSwipe(item.id, 'right')}
      >
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="scissors" size={20} color="#FFD700" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>{item.name}</Text>
            {item.badge && (
              <View style={[styles.badge, item.badge === 'Popular' ? styles.badgePopular : styles.badgeTrending]}>
                <Text style={styles.badgeText}>{item.badge === 'Popular' ? '⭐ Popular' : '🔥 Trending'}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => { setDeleteId(item.id); setShowDeleteConfirm(true); }}>
            <Icon name="trash" size={18} color="#D11A2A" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          {item.image && <Image source={{ uri: item.image }} style={styles.cardImage} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.cardPrice}>₹ {item.price}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
            <View style={styles.cardFooter}>
              <View style={[styles.categoryTag, styles['cat_' + item.category.toLowerCase()]]}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search & Filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Icon name="search" size={18} color="#888" style={{ marginRight: 6 }} />
          <TextInput
            placeholder="Search services..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#aaa"
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterCategory(filterCategory === 'All' ? CATEGORIES[0] : 'All')}>
          <Icon name="filter" size={18} color="#FFD700" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setSortOption(sortOption === 'PriceLowHigh' ? 'Default' : 'PriceLowHigh')}>
          <Icon name="sort" size={18} color="#FFD700" />
        </TouchableOpacity>
      </View>
      {/* Category Filter */}
      <View style={styles.categoryRow}>
        <TouchableOpacity
          style={[styles.categoryBtn, filterCategory === 'All' && styles.categoryBtnActive]}
          onPress={() => setFilterCategory('All')}
        >
          <Text style={[styles.categoryText, filterCategory === 'All' && styles.categoryTextActive]}>All</Text>
        </TouchableOpacity>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryBtn, filterCategory === cat && styles.categoryBtnActive]}
            onPress={() => setFilterCategory(cat)}
          >
            <Text style={[styles.categoryText, filterCategory === cat && styles.categoryTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Service List */}
      {isEmpty ? (
        <View style={styles.emptyState}>
          <Icon name="meh-o" size={60} color="#FFD700" style={{ marginBottom: 12 }} />
          <Text style={styles.emptyText}>No services added yet</Text>
          <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
            <Text style={styles.addBtnText}>+ Add Service</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderService}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal} />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>{editMode ? 'Edit Service' : 'Add Service'}</Text>
          <TextInput
            placeholder="Service Name"
            value={form.name}
            onChangeText={v => setForm(f => ({ ...f, name: v }))}
            style={[styles.input, validation.name && styles.inputError]}
            placeholderTextColor="#aaa"
          />
          {validation.name && <Text style={styles.errorText}>{validation.name}</Text>}
          <TextInput
            placeholder="Price (₹)"
            value={form.price}
            onChangeText={v => setForm(f => ({ ...f, price: v.replace(/[^0-9]/g, '') }))}
            keyboardType="numeric"
            style={[styles.input, validation.price && styles.inputError]}
            placeholderTextColor="#aaa"
          />
          {validation.price && <Text style={styles.errorText}>{validation.price}</Text>}
          <TextInput
            placeholder="Description"
            value={form.description}
            onChangeText={v => setForm(f => ({ ...f, description: v }))}
            style={[styles.input, validation.description && styles.inputError]}
            placeholderTextColor="#aaa"
            multiline
          />
          {validation.description && <Text style={styles.errorText}>{validation.description}</Text>}
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Category:</Text>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, form.category === cat && styles.catPillActive]}
                onPress={() => setForm(f => ({ ...f, category: cat }))}
              >
                <Text style={[styles.catPillText, form.category === cat && styles.catPillTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Badge:</Text>
            {BADGES.map(badge => (
              <TouchableOpacity
                key={badge}
                style={[styles.catPill, form.badge === badge && styles.catPillActive]}
                onPress={() => setForm(f => ({ ...f, badge: badge === form.badge ? '' : badge }))}
              >
                <Text style={[styles.catPillText, form.badge === badge && styles.catPillTextActive]}>{badge}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Image picker placeholder */}
          {/* <TouchableOpacity style={styles.imagePicker}><Text>Add Image</Text></TouchableOpacity> */}
          <TouchableOpacity style={styles.modalBtn} onPress={handleSubmit}>
            <Text style={styles.modalBtnText}>{editMode ? 'Update' : 'Add Service'}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Delete Confirmation */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>Are you sure you want to delete this service?</Text>
            <View style={styles.confirmRow}>
              <TouchableOpacity style={styles.confirmBtn} onPress={() => setShowDeleteConfirm(false)}>
                <Text style={styles.confirmBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, styles.confirmBtnDelete]} onPress={() => handleDelete(deleteId)}>
                <Text style={[styles.confirmBtnText, { color: '#fff' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Toast */}
      {toast.visible && (
        <View style={[styles.toast, toast.type === 'error' ? styles.toastError : styles.toastSuccess]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  searchRow: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingBottom: 0 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#222', paddingVertical: 8 },
  filterBtn: { backgroundColor: '#fff', borderRadius: 10, padding: 8, marginLeft: 4 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 8 },
  categoryBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 16, backgroundColor: '#eee', marginRight: 8 },
  categoryBtnActive: { backgroundColor: '#FFD70022' },
  categoryText: { color: '#888', fontSize: 14 },
  categoryTextActive: { color: '#222', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 12, marginVertical: 6, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  swipeArea: { flex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#23232A', marginRight: 8 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 6 },
  badgePopular: { backgroundColor: '#FFD70022' },
  badgeTrending: { backgroundColor: '#FF572222' },
  badgeText: { color: '#D4AF37', fontWeight: 'bold', fontSize: 12 },
  cardBody: { flexDirection: 'row', alignItems: 'center' },
  cardImage: { width: 48, height: 48, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' },
  cardPrice: { color: '#FFD700', fontWeight: 'bold', fontSize: 20, marginBottom: 2 },
  cardDesc: { color: '#888', fontSize: 14, marginBottom: 4 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  categoryTag: { backgroundColor: '#FFD70022', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6 },
  cat_haircut: { backgroundColor: '#FFD70022' },
  cat_beard: { backgroundColor: '#FF572222' },
  cat_facial: { backgroundColor: '#4FC3F722' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { color: '#888', fontSize: 18, marginBottom: 16 },
  addBtn: { backgroundColor: '#FFD700', borderRadius: 20, paddingHorizontal: 24, paddingVertical: 10 },
  addBtnText: { color: '#222', fontWeight: 'bold', fontSize: 16 },
  fab: { position: 'absolute', right: 24, bottom: 32, backgroundColor: '#FFD700', borderRadius: 32, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  modalOverlay: { flex: 1, backgroundColor: '#0008' },
  modalSheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, elevation: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#23232A', marginBottom: 16 },
  input: { backgroundColor: '#F7F7F7', borderRadius: 10, padding: 12, fontSize: 16, color: '#222', marginBottom: 8 },
  inputError: { borderColor: '#D11A2A', borderWidth: 1 },
  errorText: { color: '#D11A2A', fontSize: 13, marginBottom: 4 },
  modalRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  modalLabel: { color: '#888', fontSize: 15, marginRight: 8 },
  catPill: { backgroundColor: '#eee', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8 },
  catPillActive: { backgroundColor: '#FFD70022' },
  catPillText: { color: '#888', fontSize: 14 },
  catPillTextActive: { color: '#222', fontWeight: 'bold' },
  modalBtn: { backgroundColor: '#FFD700', borderRadius: 16, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  modalBtnText: { color: '#222', fontWeight: 'bold', fontSize: 16 },
  confirmOverlay: { flex: 1, backgroundColor: '#0008', alignItems: 'center', justifyContent: 'center' },
  confirmBox: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 300, alignItems: 'center' },
  confirmText: { color: '#23232A', fontSize: 16, marginBottom: 16, textAlign: 'center' },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  confirmBtn: { flex: 1, alignItems: 'center', padding: 10 },
  confirmBtnDelete: { backgroundColor: '#D11A2A', borderRadius: 8, marginLeft: 8 },
  confirmBtnText: { color: '#23232A', fontWeight: 'bold', fontSize: 15 },
  toast: { position: 'absolute', bottom: 100, left: 32, right: 32, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  toastSuccess: { borderLeftWidth: 6, borderLeftColor: '#4CAF50' },
  toastError: { borderLeftWidth: 6, borderLeftColor: '#D11A2A' },
  toastText: { color: '#23232A', fontWeight: 'bold', fontSize: 15 },
});

export default Services;
