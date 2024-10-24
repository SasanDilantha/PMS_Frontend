import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../../../theme/ThemeContext";
import { useTranslation } from "react-i18next";

const FarmManagerFarmDetailsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [newModalVisible, setNewModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    placementId: "",
    weight: "",
    feedConsumption: "",
    mortality_quantity: "",
    placement_id: "",
  });

  const sampleData = {
    farmManager: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      contactNumber: "123-456-7890",
    },
    totalEmployees: 10,
    farm: {
      name: "Sample Farm",
      startedChickCount: 500,
      currentChickCount: 450,
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[styles.detailCard, { backgroundColor: theme.cardBackground }]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          {sampleData.farm.name}
        </Text>
        <Text style={[styles.detailText, { color: theme.text }]}>
          {t("started_chick_count")}: {sampleData.farm.startedChickCount}
        </Text>
        <Text style={[styles.detailText, { color: theme.text }]}>
          {t("remaining_chick_count")}: {sampleData.farm.currentChickCount}
        </Text>
        <Text style={[styles.detailText, { color: theme.text }]}>
          {t("total_employees")}: {sampleData.totalEmployees}
        </Text>
      </View>
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.cardBackground }]}
          onPress={() => navigation.navigate("FarmManager_ChickInventory")}
        >
          <MaterialIcons name="egg" size={40} color={theme.primary} />
          <Text style={[styles.cardText, { color: theme.text }]}>
            {t("chick_inventory")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.cardBackground }]}
          onPress={() => navigation.navigate("FarmManager_FeedInventory")}
        >
          <MaterialIcons name="grass" size={40} color={theme.primary} />
          <Text style={[styles.cardText, { color: theme.text }]}>
            {t("feed_inventory")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.cardBackground }]}
          onPress={() => navigation.navigate("FarmManager_Monitoring")}
        >
          <MaterialIcons name="visibility" size={40} color={theme.primary} />
          <Text style={[styles.cardText, { color: theme.text }]}>
            {t("monitoring")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.cardBackground }]}
          onPress={() => navigation.navigate("FarmManager_MedicalInventory")}
        >
          <MaterialIcons name="healing" size={40} color={theme.primary} />
          <Text style={[styles.cardText, { color: theme.text }]}>
            {t("medical_inventory")}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: theme.primary }]}
        onPress={() => setNewModalVisible(true)}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {t("farm_manager_details")}
            </Text>
            <Text style={[styles.modalText, { color: theme.text }]}>
              {t("name")}: {sampleData.farmManager.name}
            </Text>
            <Text style={[styles.modalText, { color: theme.text }]}>
              {t("email")}: {sampleData.farmManager.email}
            </Text>
            <Text style={[styles.modalText, { color: theme.text }]}>
              {t("contact_number")}: {sampleData.farmManager.contactNumber}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>{t("close")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* New Modal for Adding Data */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={newModalVisible}
        onRequestClose={() => setNewModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {t("add_new_data")}
            </Text>

            <TextInput
              placeholder={t("placement_id")}
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.primary },
              ]}
              placeholderTextColor={theme.placeholder}
              value={formData.placementId}
              onChangeText={(text) =>
                setFormData({ ...formData, placementId: text })
              }
              keyboardType="numeric"
            />
            <TextInput
              placeholder={t("weight")}
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.primary },
              ]}
              placeholderTextColor={theme.placeholder}
              value={formData.weight}
              onChangeText={(text) =>
                setFormData({ ...formData, weight: text })
              }
              keyboardType="numeric"
            />
            <TextInput
              placeholder={t("feed_consumption")}
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.primary },
              ]}
              placeholderTextColor={theme.placeholder}
              value={formData.feedConsumption}
              onChangeText={(text) =>
                setFormData({ ...formData, feedConsumption: text })
              }
              keyboardType="numeric"
            />
            <TextInput
              placeholder={t("mortality_quantity")}
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.primary },
              ]}
              placeholderTextColor={theme.placeholder}
              value={formData.mortality_quantity}
              onChangeText={(text) =>
                setFormData({ ...formData, mortality_quantity: text })
              }
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setNewModalVisible(false)}
              >
                <Text style={styles.buttonText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={() => setNewModalVisible(false)}
              >
                <Text style={styles.buttonText}>{t("add")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  detailCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  detailText: {
    fontSize: 18,
    marginBottom: 4,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
  },
  cardText: {
    marginTop: 8,
    fontSize: 16,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#757575",
  },
  addButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FarmManagerFarmDetailsScreen;
