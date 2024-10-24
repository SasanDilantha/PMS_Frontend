import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "../../theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../services/bas_url";

const UserManagementScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [allFarms, setAllFarms] = useState([]);
  const [items, setItems] = useState([
    allFarms.map((farm) => ({
      label: farm.farm_name,
      value: farm.farm_code,
    })),
  ]); // set farms for deopdown

  // get all farms
  useEffect(() => {
    const getAllFarms = async () => {
      try {
        console.log("Fetching farms...");
        const response = await axios.get(BASE_URL + ":8222/api/farm");
        setAllFarms(response.data);
        console.log("Farms fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    getAllFarms();
  }, []);

  const [employees, setEmployees] = useState([]);

  // get all users
  useEffect(() => {
    const allUsers = async () => {
      try {
        const response = await axios.get(BASE_URL + ":8222/api/user/all/ui");
        setEmployees(response.data);
        console.log("Farms fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    allUsers();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    farm: "",
    username: "",
    password: "",
    farmCode: "",
    role: "",
  });
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [roleDropdownValue, setRoleDropdownValue] = useState(null);
  const [roleDropdownItems, setRoleDropdownItems] = useState([
    { label: "MANAGER", value: "MANAGER" },
    { label: "VET", value: "VET" },
  ]);
  const [farmCodeDropdownOpen, setFarmCodeDropdownOpen] = useState(false);
  const [farmCodeDropdownValue, setFarmCodeDropdownValue] = useState(null);
  const [farms, setFams] = useState([]);
  const [farmCodeDropdownItems, setFarmCodeDropdownItems] = useState([
    farms.map((farm) => ({
      label: farm.farm_name,
      value: farm.farm_code,
    })),
  ]);

  // get all farms codes
  useEffect(() => {
    const getAllFarmsCodes = async () => {
      try {
        const response = await axios.get(BASE_URL + ":8222/api/farm");
        setFams(response.data);
        console.log("Farms fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    getAllFarmsCodes();
  }, []);

  const [callModalVisible, setCallModalVisible] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);

  const handleAddEmployee = async () => {
    if (
      !newEmployee.first_name ||
      !newEmployee.last_name ||
      !newEmployee.email ||
      !newEmployee.phone ||
      !newEmployee.password ||
      !roleDropdownValue || // Role
      !farmCodeDropdownValue // Farm code
    ) {
      Alert.alert(t("error"), t("fill_all_fields"));
      return;
    }

    const employeeData = {
      first_name: newEmployee.first_name,
      last_name: newEmployee.last_name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      password: newEmployee.password,
      role: roleDropdownValue,
      farm_code: farmCodeDropdownValue,
    };

    try {
      const response = await fetch(BASE_URL + ":8222/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        const createdEmployee = await response.json();
        if (isEditing) {
          setEmployees(
            employees.map((employee) =>
              employee.id === editEmployeeId
                ? {
                    ...newEmployee,
                    id: editEmployeeId,
                    role: roleDropdownValue,
                    farmCode: farmCodeDropdownValue,
                  }
                : employee
            )
          );
          setIsEditing(false);
          setEditEmployeeId(null);
        } else {
          setEmployees([
            ...employees,
            {
              ...newEmployee,
              id: createdEmployee.id, // Use the id from the response
              role: roleDropdownValue,
              farmCode: farmCodeDropdownValue,
            },
          ]);
        }

        setNewEmployee({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          address: "",
          farm: "",
          username: "",
          password: "",
          farmCode: "",
          role: "",
        });
        setRoleDropdownValue(null);
        setFarmCodeDropdownValue(null);
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to add employee");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
      console.error(error);
    }
  };

  const handleEditEmployee = (employee) => {
    setNewEmployee(employee);
    setRoleDropdownValue(employee.role);
    setFarmCodeDropdownValue(employee.farmCode);
    setEditEmployeeId(employee.id);
    setIsEditing(true);
    setModalVisible(true);
  };

  const openAddEmployeeModal = () => {
    setNewEmployee({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      farm: "",
      username: "",
      password: "",
      farmCode: "",
      role: "",
    });
    setRoleDropdownValue(null);
    setFarmCodeDropdownValue(null);
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleDeleteEmployee = () => {
    if (password === "adminPassword") {
      setEmployees(
        employees.filter((employee) => employee.id !== employeeToDelete.id)
      );
      setDeleteModalVisible(false);
    } else {
      Alert.alert(t("error"), t("incorrect_password"));
    }
    setPassword("");
  };

  const confirmDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalVisible(true);
  };

  const openCallConfirmation = (phoneNumber) => {
    setSelectedPhoneNumber(phoneNumber);
    setCallModalVisible(true);
  };

  const makeCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openDetailsModal = (employee) => {
    setViewEmployee(employee);
    setDetailsModalVisible(true);
  };

  const renderEmployee = ({ item }) => (
    <View
      key={item.id}
      style={[styles.card, { backgroundColor: theme.cardBackground }]}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardLabel, { color: theme.text }]}>
            {" "}
            {t("name")}:
          </Text>
          <Text style={[styles.cardText, { color: theme.text }]}>
            {item.first_name} {item.last_name}
          </Text>
        </View>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardLabel, { color: theme.text }]}>
            {" "}
            {t("role")}:
          </Text>
          <Text style={[styles.cardText, { color: theme.text }]}>
            {item.role}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => openDetailsModal(item)}
            style={styles.detailsIcon}
          >
            <Icon name="eye" size={24} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleEditEmployee(item)}
            style={styles.editIcon}
          >
            <Icon name="pencil" size={24} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => confirmDeleteEmployee(item)}
            style={styles.deleteIcon}
          >
            <Icon name="delete" size={24} color="#FF5722" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openCallConfirmation(item.phone)}
            style={styles.callIcon}
          >
            <Icon name="phone" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.message, { color: theme.text }]}>
        {t("please_select_farm")}
      </Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={t("select_farm")}
        onChangeValue={(itemValue) => {
          setSelectedFarm(itemValue);
        }}
        style={[
          styles.picker,
          {
            backgroundColor: theme.cardBackground,
            borderColor: theme.borderColor,
          },
        ]}
        dropDownContainerStyle={{
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderColor,
        }}
        textStyle={{ color: theme.text }}
        placeholderStyle={{ color: theme.text }}
        arrowIconStyle={{ tintColor: theme.text }}
      />

      {selectedFarm && (
        <FlatList
          data={employees.filter((employee) => employee.farm === selectedFarm)}
          renderItem={renderEmployee}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.section}
          ListHeaderComponent={
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: theme.cardBackground },
              ]}
            >
              <Text style={[styles.summaryText, { color: theme.text }]}>
                {t("farm")}: {selectedFarm}
              </Text>
              <Text style={[styles.summaryText, { color: theme.text }]}>
                {" "}
                {t("total_employees")}:{" "}
                {
                  employees.filter((employee) => employee.farm === selectedFarm)
                    .length
                }
              </Text>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={openAddEmployeeModal}
              >
                <Icon name="account-plus" size={24} color="#fff" />
                <Text style={styles.buttonText}>{t("add_employee")}</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {!selectedFarm && (
        <Image
          source={require("../../assets/chick_user_man.png")}
          style={styles.placeholderImage}
        />
      )}

      {/* Add/Edit Employee Modal */}
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
              {isEditing ? t("edit_employee") : t("add_new_employee")}
            </Text>

            <DropDownPicker
              open={farmCodeDropdownOpen}
              value={farmCodeDropdownValue}
              items={farmCodeDropdownItems}
              setOpen={setFarmCodeDropdownOpen}
              setValue={setFarmCodeDropdownValue}
              setItems={setFarmCodeDropdownItems}
              placeholder={t("select_farm_code")}
              style={[
                styles.picker,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.borderColor,
                },
              ]}
              dropDownContainerStyle={{
                backgroundColor: theme.inputBackground,
                borderColor: theme.borderColor,
              }}
              textStyle={{ color: theme.inputText }}
              placeholderStyle={{ color: theme.placeholderText }}
              arrowIconStyle={{ tintColor: theme.text }}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  color: theme.inputText,
                },
              ]}
              placeholder={t("first_name")}
              placeholderTextColor={theme.placeholderText}
              value={newEmployee.first_name}
              onChangeText={(text) =>
                setNewEmployee({ ...newEmployee, first_name: text })
              }
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  color: theme.inputText,
                },
              ]}
              placeholder={t("last_name")}
              placeholderTextColor={theme.placeholderText}
              value={newEmployee.last_name}
              onChangeText={(text) =>
                setNewEmployee({ ...newEmployee, last_name: text })
              }
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  color: theme.inputText,
                },
              ]}
              placeholder={t("email")}
              placeholderTextColor={theme.placeholderText}
              value={newEmployee.email}
              onChangeText={(text) =>
                setNewEmployee({ ...newEmployee, email: text })
              }
              keyboardType="email-address"
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  color: theme.inputText,
                },
              ]}
              placeholder={t("phone")}
              placeholderTextColor={theme.placeholderText}
              value={newEmployee.phone}
              onChangeText={(text) =>
                setNewEmployee({ ...newEmployee, phone: text })
              }
              keyboardType="phone-pad"
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  color: theme.inputText,
                },
              ]}
              placeholder={t("address")}
              placeholderTextColor={theme.placeholderText}
              value={newEmployee.address}
              onChangeText={(text) =>
                setNewEmployee({ ...newEmployee, address: text })
              }
            />
            <DropDownPicker
              open={roleDropdownOpen}
              value={roleDropdownValue}
              items={roleDropdownItems}
              setOpen={setRoleDropdownOpen}
              setValue={setRoleDropdownValue}
              setItems={setRoleDropdownItems}
              placeholder={t("select_role")}
              style={[
                styles.picker,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.borderColor,
                },
              ]}
              dropDownContainerStyle={{
                backgroundColor: theme.inputBackground,
                borderColor: theme.borderColor,
              }}
              textStyle={{ color: theme.inputText }}
              placeholderStyle={{ color: theme.placeholderText }}
              arrowIconStyle={{ tintColor: theme.text }}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  color: theme.inputText,
                },
              ]}
              placeholder={t("username")}
              placeholderTextColor={theme.placeholderText}
              value={newEmployee.username}
              onChangeText={(text) =>
                setNewEmployee({ ...newEmployee, username: text })
              }
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  color: theme.inputText,
                },
              ]}
              placeholder={t("password")}
              placeholderTextColor={theme.placeholderText}
              value={newEmployee.password}
              onChangeText={(text) =>
                setNewEmployee({ ...newEmployee, password: text })
              }
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.saveButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={handleAddEmployee}
              >
                <Text style={styles.buttonText}>
                  {isEditing ? t("save_changes") : t("add_employee")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Employee Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {t("are_you_sure")}
            </Text>
            <Text style={{ color: theme.text }}>
              {t("delete_employee_confirmation")} {employeeToDelete?.first_name}{" "}
              {employeeToDelete?.last_name}?
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  color: theme.inputText,
                },
              ]}
              placeholder={t("password")}
              placeholderTextColor={theme.placeholderText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.buttonText}>{t("no")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.deleteButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={handleDeleteEmployee}
              >
                <Text style={styles.buttonText}>{t("yes")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Call Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={callModalVisible}
        onRequestClose={() => setCallModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {t("confirm_call")}
            </Text>
            <Text style={{ color: theme.text }}>
              {t("do_you_want_to_call")} {selectedPhoneNumber}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCallModalVisible(false)}
              >
                <Text style={styles.buttonText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.saveButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={() => {
                  setCallModalVisible(false);
                  makeCall(selectedPhoneNumber);
                }}
              >
                <Text style={styles.buttonText}>{t("call")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Employee Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {t("employee_details")}
            </Text>
            {viewEmployee && (
              <View style={styles.detailsContent}>
                <Text style={[styles.detailsText, { color: theme.text }]}>
                  {t("name")}: {viewEmployee.first_name}{" "}
                  {viewEmployee.last_name}
                </Text>
                <Text style={[styles.detailsText, { color: theme.text }]}>
                  {t("role")}: {viewEmployee.role}
                </Text>
                <Text style={[styles.detailsText, { color: theme.text }]}>
                  {t("email")}: {viewEmployee.email}
                </Text>
                <Text style={[styles.detailsText, { color: theme.text }]}>
                  {t("phone")}: {viewEmployee.phone}
                </Text>
                <Text style={[styles.detailsText, { color: theme.text }]}>
                  {t("address")}: {viewEmployee.address}
                </Text>
                <Text style={[styles.detailsText, { color: theme.text }]}>
                  {t("username")}: {viewEmployee.username}
                </Text>
                <Text style={[styles.detailsText, { color: theme.text }]}>
                  {t("farm_code")}: {viewEmployee.farmCode}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.cancelButton,
                { marginTop: 20 },
              ]}
              onPress={() => setDetailsModalVisible(false)}
            >
              <Text style={styles.buttonText}>{t("close")}</Text>
            </TouchableOpacity>
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
  message: {
    fontSize: 18,
    marginBottom: 16,
  },
  picker: {
    marginBottom: 24,
    padding: 12,
    borderRadius: 8,
    elevation: 3,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
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
  deleteButton: {
    backgroundColor: "#FF5722",
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 4,
  },
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  detailsIcon: {
    marginRight: 8,
  },
  editIcon: {
    marginRight: 8,
  },
  deleteIcon: {
    marginRight: 8,
  },
  callIcon: {
    marginRight: 1,
  },
  placeholderImage: {
    width: "100%",
    height: "50%",
    resizeMode: "contain",
    marginTop: 120,
  },
  detailsContent: {
    width: "100%",
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default UserManagementScreen;
