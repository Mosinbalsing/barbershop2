import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PremiumHeader } from '../../../shared/components/PremiumScaffold';
import {
  premiumShadow,
  premiumSpacing,
  usePremiumTheme,
} from '../../../shared/theme/premiumTheme';
import { useGetServices } from './ServiceApi';
// Static initial data removed — services and categories are loaded
// from the backend and mapped into the UI-friendly shape below.

const Services = () => {
  const serviceListRef = useRef<FlatList<any>>(null);
  const { colors: premiumColors } = usePremiumTheme();
  const styles = useMemo(() => createStyles(premiumColors), [premiumColors]);
  const [categories, setCategories] = useState<Array<any>>([]);
  const [services, setServices] = useState<Array<any>>([]);
  const [category, setCategory] = useState('all');
  const [backendJson, setBackendJson] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
    category: 'hair',
  });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editMode, setEditMode] = useState(false);
  const { data: fetchedServices, isLoading } = useGetServices();
  // Map backend response (categories with nested services) into flat
  // categories and services expected by the UI.
  useEffect(() => {
    if (!fetchedServices) return;

    const iconMap: Record<string, string> = {
      haircut: 'scissors',
      haircutting: 'scissors',
      hair: 'scissors',
      shaving: 'user',
      grooming: 'user',
      treatment: 'magic',
      skin: 'star',
      massage: 'hand-paper-o',
    };

    const mappedCategories = fetchedServices.map((cat: any) => ({
      id: String(cat.id),
      name: cat.name,
      shortName:
        typeof cat.name === 'string' && cat.name.length > 10
          ? cat.name.slice(0, 10) + '…'
          : cat.name,
      icon:
        iconMap[(cat.name || '').toString().toLowerCase()] || 'tag',
    }));

    const mappedServices = fetchedServices.flatMap((cat: any) =>
      (cat.services || []).map((s: any) => ({
        id: String(s.id),
        name: s.name,
        price: s.cost != null ? String(s.cost) : '',
        duration:
          typeof s.duration === 'number' ? `${s.duration} min` : s.duration || '30 min',
        description: s.description || '',
        category: String(cat.id),
        tone: '#F1ECFF',
        icon:
          iconMap[(cat.name || '').toString().toLowerCase()] || 'scissors',
      })),
    );

    setCategories(mappedCategories);
    setServices(mappedServices);
    // If no category selected yet (default 'all' or empty), activate first category
    setCategory(curr =>
      curr === 'all' || curr === '' ? mappedCategories[0]?.id ?? 'all' : curr,
    );
    setBackendJson(JSON.stringify(fetchedServices, null, 2));
  }, [fetchedServices]);

  console.log('this is my services from backend', services);

  const filtered = useMemo(
    () =>
      services.filter(
        service =>
          (category === 'all' || service.category === category) &&
          service.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [category, search, services],
  );

  const saveService = () => {
    if (!form.name.trim() || !form.price.trim()) return;
    if (editingServiceId) {
      // Update existing service
      setServices(prev =>
        prev.map(s =>
          s.id === editingServiceId
            ? {
                ...s,
                ...form,
                price: form.price,
                duration: form.duration.trim() || '30 min',
              }
            : s,
        ),
      );
    } else {
      setServices(prev => [
        {
          ...form,
          id: Date.now().toString(),
          duration: form.duration.trim() || '30 min',
          tone: '#F1ECFF',
          icon: 'scissors',
        },
        ...prev,
      ]);
    }
    setForm({
      name: '',
      price: '',
      duration: '',
      description: '',
      category: 'hair',
    });
    setEditingServiceId(null);
    setModalOpen(false);
  };

  const selectCategory = (nextCategory: string) => {
    setCategory(nextCategory);
    serviceListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Open modal handler with optional service for editing
  const handleOpenModal = (service?: any) => {
    console.log('Services: open modal requested', {
      modalOpen,
      categoriesCount: categories.length,
      servicesCount: services.length,
      editing: !!service,
    });
    if (service) {
      setEditingServiceId(service.id);
      setForm({
        name: service.name || '',
        price: service.price != null ? String(service.price) : service.price || '',
        duration: service.duration || '30 min',
        description: service.description || '',
        category: service.category || categories[0]?.id || 'hair',
      });
    } else {
      setEditingServiceId(null);
      setForm({ name: '', price: '', duration: '', description: '', category: categories[0]?.id || 'hair' });
    }
    setModalOpen(true);
  };

  // Log modalOpen changes so we can see when the state actually updates
  useEffect(() => {
    console.log('Services: modalOpen changed ->', modalOpen);
  }, [modalOpen]);

  const handleAddCategoryClick = () => {
    setShowCategoryInput(v => !v);
  };

  // Add new category logic
  const handleSaveNewCategory = () => {
    if (!newCategory.trim()) return;
    // Generate a unique id
    const id =
      newCategory
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '') +
      '-' +
      Date.now();
    setCategories(prev => [
      ...prev,
      {
        id,
        name: newCategory.trim(),
        shortName:
          newCategory.trim().length > 10
            ? newCategory.trim().slice(0, 10) + '…'
            : newCategory.trim(),
        icon: 'tag',
      },
    ]);
    setShowCategoryInput(false);
    setNewCategory('');
  };

  // Remove category with confirmation
  const handleRemoveCategory = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    const relatedServices = services.filter(s => s.category === catId);
    Alert.alert(
      'Remove Category',
      `Are you sure you want to remove "${cat?.name}"? This will also remove ${relatedServices.length} service(s) in this category.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setCategories(prev => prev.filter(c => c.id !== catId));
            setServices(prev => prev.filter(s => s.category !== catId));
            if (category === catId) setCategory(categories[0]?.id || '');
          },
        },
      ],
    );
  };

  // Remove service
  const handleRemoveService = (serviceId: string) => {
    Alert.alert(
      'Remove Service',
      'Are you sure you want to remove this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setServices(prev => prev.filter(s => s.id !== serviceId));
          },
        },
      ],
    );
  };

  // Helper to close modal and reset category input state
  const handleCloseModal = () => {
    setModalOpen(false);
    setShowCategoryInput(false);
    setNewCategory('');
  };

  return (
    <View style={styles.screen}>
   
      <PremiumHeader
        eyebrow="Catalog"
        title="Services"
        subtitle="Manage salon plans, prices, and booking time."
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditMode(e => !e)}
            >
              <Icon
                name={editMode ? 'check' : 'edit'}
                size={18}
                color={premiumColors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addCircle, { marginLeft: 8 }]}
              onPress={handleOpenModal}
            >
              <Icon name="plus" size={18} color={premiumColors.surface} />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.searchBox}>
        <Icon name="search" size={18} color={premiumColors.ink} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search haircut, facial, massage and more"
          placeholderTextColor={premiumColors.muted}
          style={styles.searchInput}
        />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FlatList
          horizontal
          data={categories}
          style={styles.categoryNav}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const active = category === item.id;
            return (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => selectCategory(item.id)}
                >
                  <View
                    style={[
                      styles.categoryIconWrap,
                      active && [
                        styles.categoryIconActive,
                        { backgroundColor: premiumColors.primary + '33' },
                      ],
                    ]}
                  >
                    <Icon
                      name={item.icon}
                      size={21}
                      color={active ? premiumColors.ink : premiumColors.muted}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.categoryLabel,
                      {
                        color: active ? premiumColors.ink : premiumColors.muted,
                      },
                      active && styles.categoryLabelActive,
                    ]}
                  >
                    {item.shortName}
                  </Text>
                  {active && <View style={styles.activeBar} />}
                </TouchableOpacity>
                {editMode && (
                  <TouchableOpacity
                    style={styles.editIconButton}
                    onPress={() => handleRemoveCategory(item.id)}
                  >
                    <Icon
                      name="trash"
                      size={16}
                      color={premiumColors.primary}
                    />
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
        {/* <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditMode(e => !e)}
        >
          <Icon name={editMode ? 'check' : 'edit'} size={18} color={premiumColors.primary} />
        </TouchableOpacity> */}
      </View>

      <FlatList
        ref={serviceListRef}
        data={filtered}
        style={styles.serviceList}
        keyExtractor={item => item.id}
        numColumns={2}
        key="service-grid"
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => (editMode ? handleOpenModal(item) : null)}
            style={styles.card}
          >
            <View style={[styles.visualBox, { backgroundColor: item.tone }]}>
              <View style={styles.serviceIconCircle}>
                <Icon name={item.icon} size={28} color={premiumColors.ink} />
              </View>
              <Text style={styles.visualText} numberOfLines={2}>
                {item.name}
              </Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.cardMeta}>
                <Text style={styles.price}>₹{item.price}</Text>
                <View style={styles.timePill}>
                  <Icon name="clock-o" size={11} color={premiumColors.muted} />
                  <Text style={styles.timeText}>{item.duration}</Text>
                </View>
                {editMode && (
                  <View style={styles.editIconColumn}>
                    <TouchableOpacity
                      style={styles.editIconButton}
                      onPress={() => handleOpenModal(item)}
                    >
                      <Icon name="pencil" size={14} color={premiumColors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editIconButton, { marginTop: 6 }]}
                      onPress={() => handleRemoveService(item.id)}
                    >
                      <Icon name="trash" size={16} color={premiumColors.primary} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No services match your search.</Text>
        }
      />

      {modalOpen && (
        <View style={styles.overlay} pointerEvents="box-none">
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={handleCloseModal}
          />
          <View style={styles.sheet}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={handleCloseModal}
            >
              <Icon name="close" size={22} color={premiumColors.ink} />
            </TouchableOpacity>
            <Text style={styles.sheetTitle}>{editingServiceId ? 'Edit Service' : 'Add Service'}</Text>
            {showCategoryInput && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  placeholder="New Category Name"
                  placeholderTextColor={premiumColors.muted}
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={newCategory}
                  onChangeText={setNewCategory}
                  autoFocus
                />
                <TouchableOpacity
                  style={styles.saveCategoryButton}
                  onPress={handleSaveNewCategory}
                >
                  <Icon name="check" size={18} color={premiumColors.surface} />
                </TouchableOpacity>
              </View>
            )}
            <TextInput
              placeholder="Service name"
              placeholderTextColor={premiumColors.muted}
              style={styles.input}
              value={form.name}
              onChangeText={name => setForm(prev => ({ ...prev, name }))}
            />
            <TextInput
              placeholder="Price"
              placeholderTextColor={premiumColors.muted}
              style={styles.input}
              keyboardType="numeric"
              value={form.price}
              onChangeText={price =>
                setForm(prev => ({
                  ...prev,
                  price: price.replace(/[^0-9]/g, ''),
                }))
              }
            />
            <TextInput
              placeholder="Duration eg. 30 min"
              placeholderTextColor={premiumColors.muted}
              style={styles.input}
              value={form.duration}
              onChangeText={duration =>
                setForm(prev => ({ ...prev, duration }))
              }
            />
            <TextInput
              placeholder="Description"
              placeholderTextColor={premiumColors.muted}
              style={styles.input}
              value={form.description}
              onChangeText={description =>
                setForm(prev => ({ ...prev, description }))
              }
            />
            <View style={styles.categoryRowCompact}>
              {categories
                .filter(item => item.id !== 'all')
                .map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.categoryPill,
                      form.category === item.id && styles.categoryPillActive,
                    ]}
                    onPress={() =>
                      setForm(prev => ({ ...prev, category: item.id }))
                    }
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        form.category === item.id && styles.categoryTextActive,
                      ]}
                    >
                      {item.shortName}
                    </Text>
                  </TouchableOpacity>
                ))}
              <TouchableOpacity
                style={styles.addCategoryButton}
                onPress={handleAddCategoryClick}
              >
                <Text style={styles.addCategoryButtonText}>+ Add Category</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={saveService}
            >
              <Text style={styles.primaryButtonText}>Save Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const createStyles = (
  premiumColors: ReturnType<typeof usePremiumTheme>['colors'],
) =>
  StyleSheet.create({
    editButton: {
      marginLeft: 8,
      padding: 8,
      borderRadius: 8,
      backgroundColor: premiumColors.surface,
      borderWidth: 1,
      borderColor: premiumColors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      height: 36,
      width: 36,
    },
    editIconButton: {
      marginLeft: 2,
      padding: 4,
      borderRadius: 8,
      backgroundColor: premiumColors.surface,
      borderWidth: 1,
      borderColor: premiumColors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      height: 28,
      width: 28,
    },
    editIconColumn: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveCategoryButton: {
      marginLeft: 8,
      backgroundColor: premiumColors.primary,
      borderRadius: 8,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewCard: {
      backgroundColor: premiumColors.ink,
      borderRadius: 18,
      padding: 14,
      marginTop: 14,
    },
    previewTitle: {
      color: premiumColors.secondary,
      fontSize: 13,
      fontWeight: '900',
      marginBottom: 8,
    },
    previewText: { color: premiumColors.surface, fontSize: 12, lineHeight: 18 },
    screen: { flex: 1, backgroundColor: premiumColors.canvas },
    addCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: premiumColors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...premiumShadow,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: premiumSpacing.screen,
      backgroundColor: premiumColors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: premiumColors.line,
      paddingHorizontal: 16,
      minHeight: 56,
      ...premiumShadow,
    },
    searchInput: {
      flex: 1,
      color: premiumColors.ink,
      fontSize: 15,
      paddingVertical: 13,
      marginLeft: 10,
    },
    categoryNav: {
      flexGrow: 0,
      height: 88,
    },
    categoryList: {
      paddingHorizontal: 8,
      paddingTop: 14,
      paddingBottom: 8,
    },
    categoryItem: {
      width: 92,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    categoryIconWrap: {
      width: 42,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryIconActive: { backgroundColor: '#FFF3CD', borderRadius: 12 },
    categoryLabel: {
      color: premiumColors.nav,
      fontSize: 13,
      fontWeight: '700',
      marginTop: 3,
      maxWidth: 84,
    },
    categoryLabelActive: { color: premiumColors.ink, fontWeight: '900' },
    activeBar: {
      width: 34,
      height: 3,
      borderRadius: 2,
      backgroundColor: premiumColors.ink,
      marginTop: 8,
    },
    categoryRowCompact: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 4,
      marginBottom: 12,
    },
    categoryPill: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 14,
      backgroundColor: premiumColors.surface,
      borderWidth: 1,
      borderColor: premiumColors.line,
    },
    categoryPillActive: {
      backgroundColor: premiumColors.primary,
      borderColor: premiumColors.primary,
    },
    categoryText: {
      color: premiumColors.muted,
      fontWeight: '800',
      fontSize: 13,
    },
    categoryTextActive: { color: premiumColors.surface },
    list: {
      paddingHorizontal: premiumSpacing.screen,
      paddingTop: 0,
      paddingBottom: 112,
    },
    serviceList: { flex: 1 },
    gridRow: { gap: 14 },
    card: {
      flex: 1,
      backgroundColor: premiumColors.surface,
      borderRadius: 18,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: premiumColors.line,
      overflow: 'hidden',
      ...premiumShadow,
    },
    visualBox: {
      height: 126,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
    },
    serviceIconCircle: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: premiumColors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      ...premiumShadow,
    },
    visualText: {
      color: premiumColors.ink,
      fontSize: 15,
      fontWeight: '900',
      textAlign: 'center',
    },
    cardBody: { minHeight: 128, padding: 12 },
    cardTitle: {
      color: premiumColors.ink,
      fontSize: 15,
      fontWeight: '900',
      lineHeight: 19,
    },
    price: { color: premiumColors.primary, fontSize: 16, fontWeight: '900' },
    description: {
      color: premiumColors.muted,
      fontSize: 12,
      marginTop: 6,
      lineHeight: 16,
    },
    cardMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto',
      gap: 8,
    },
    timePill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: premiumColors.canvas,
      borderRadius: 10,
      paddingHorizontal: 7,
      paddingVertical: 5,
      gap: 4,
    },
    timeText: { color: premiumColors.muted, fontSize: 11, fontWeight: '800' },
    empty: {
      color: premiumColors.muted,
      textAlign: 'center',
      marginTop: 40,
      fontWeight: '700',
    },
    overlay: {
      // Make overlay absolute and high zIndex/elevation so it sits above other views
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(32,35,42,0.35)',
      justifyContent: 'flex-end',
      zIndex: 9999,
      elevation: 9999,
    },
    sheet: {
      backgroundColor: premiumColors.surface,
      borderTopLeftRadius: 26,
      borderTopRightRadius: 26,
      padding: 22,
      // Ensure sheet is elevated above content on Android and iOS
      zIndex: 10000,
      elevation: 10000,
    },
    sheetHandle: {
      width: 44,
      height: 5,
      borderRadius: 3,
      backgroundColor: premiumColors.line,
      alignSelf: 'center',
      marginBottom: 18,
    },
    sheetTitle: {
      color: premiumColors.ink,
      fontSize: 22,
      fontWeight: '900',
      marginBottom: 16,
    },
    input: {
      backgroundColor: premiumColors.canvas,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: premiumColors.ink,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: premiumColors.line,
    },
    primaryButton: {
      backgroundColor: premiumColors.primary,
      borderRadius: 16,
      alignItems: 'center',
      paddingVertical: 14,
      marginTop: 4,
    },
    primaryButtonText: {
      color: premiumColors.surface,
      fontSize: 16,
      fontWeight: '900',
    },
    closeIcon: {
      position: 'absolute',
      top: 12,
      right: 12,
      zIndex: 10001,
      elevation: 10001,
      padding: 8,
    },
    addCategoryButton: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 14,
      backgroundColor: premiumColors.primary,
      marginLeft: 8,
    },
    addCategoryButtonText: {
      color: premiumColors.surface,
      fontWeight: '800',
      fontSize: 13,
    },
  });

export default Services;
