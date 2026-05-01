import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getData } from '../../helper/storage';
import { premiumColors } from '../theme/premiumTheme';

const AdminStatus = ({ data }: any) => {
  const [role, setRole] = useState()
  const getRole = async () => {
    const LocalRole = await getData("user_role");
    setRole(LocalRole);
  }
  useEffect(() => {
    getRole();
  }, []);

  const normalizedRole = (role || '')
    .toLowerCase()
    .replace(/\s+/g, '');

  

  console.log("Path", normalizedRole);

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.itemContainer} onPress={() => {
            //   navigation.navigate("deleteprofilescreen", { data: item })
              console.log("This is Item On Admin List", item)
            }}>

              {/* Top Badge */}
              <View style={styles.countBox}>
                <Text style={styles.countText}>{item.count}</Text>
              </View>

              {/* Circle / Image */}
              {item.image ? (
                <Image source={item.image} style={styles.profileImage} />
              ) : (
                <LinearGradient
                  colors={[premiumColors.primary, premiumColors.secondary]}
                  style={styles.circle}
                >
                  <Text style={styles.initials}>{item.initials}</Text>
                </LinearGradient>
              )}

              {/* Name */}
              <Text style={styles.name}>
                {item?.name?.trim().split(/\s+/)[0]}
              </Text>

            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default AdminStatus;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 10
  },

  itemContainer: {
    alignItems: "center",
    marginHorizontal: 12,
    position: "relative",
  },
  countBox: {
    backgroundColor: premiumColors.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    position: "absolute",
    top: -10,
    right: -10,
    zIndex: 10,
    elevation: 3,
  },
  countText: {
    fontWeight: "700",
    fontSize: 14,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: premiumColors.surface,
    fontSize: 28,
    fontWeight: "800",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 55,
  },
  name: {
    marginTop: 5,
    fontWeight: "600",
    fontSize: 14,
    color: premiumColors.ink,
    // borderWidth: 1,
    // width:70,
    textAlign: "center"
  },
});
