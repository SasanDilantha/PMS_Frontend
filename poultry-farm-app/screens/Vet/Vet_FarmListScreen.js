// screens/Vet/Vet_FarmListScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../../theme/ThemeContext";
import { useTranslation } from "react-i18next"; // Importing translation hook
import { BASE_URL } from "../../services/bas_url";

const Vet_FarmListScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation(); // Initializing translation hook
  const [farms, setFarms] = useState([]);

  // get all farms
  useEffect(() => {
    const getAllFarms = async () => {
      try {
        console.log("Fetching farms...");
        const response = await axios.get(BASE_URL + ":8222/api/farm");
        setFarms(response.data);
        console.log("Farms fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    getAllFarms();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={farms}
        keyExtractor={(item) => item.farm_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.cardBackground }]}
            onPress={() =>
              navigation.navigate("VetFarmDetails", { farm: item })
            }
          >
            <MaterialIcons name="home" size={40} color={theme.primary} />
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {item.farm_name}
              </Text>
              <Text style={[styles.cardText, { color: theme.text }]}>
                {t("location")}: {item.location}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 16,
  },
});

export default Vet_FarmListScreen;
