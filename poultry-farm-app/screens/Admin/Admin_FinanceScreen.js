import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "../../theme/ThemeContext";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook
import { BASE_URL } from "../../services/bas_url";

const FinanceScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation(); // Initialize the translation hook

  const [transactions, setTransactions] = useState([]);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("income"); // 'income' or 'expense'
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [filterType, setFilterType] = useState("all"); // 'all', 'income', 'expense'
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

  //  transactions data
  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const response = await axios.get(BASE_URL + ":8222/api/fin/all");
        setTransactions(response.data);
        console.log("Fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching :", error);
      }
    };

    getAllTransactions();
  }, []);

  const addTransaction = () => {
    if (amount && description && selectedFarm) {
      setTransactions([
        ...transactions,
        {
          id: Date.now().toString(),
          amount,
          description,
          type,
          date: new Date().toLocaleDateString(),
          farm: selectedFarm,
        },
      ]);
      setAmount("");
      setDescription("");
    } else {
      alert(t("fill_all_fields"));
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "all") return t.farm_code === selectedFarm;
    return t.farm_code === selectedFarm && t.expense_type === filterType;
  });

  const totalIncome = transactions
    .filter((t) => t.farm === selectedFarm && t.type === "income")
    .reduce((acc, t) => acc + parseFloat(t.amount), 0)
    .toFixed(2);
  const totalExpenses = transactions
    .filter((t) => t.farm === selectedFarm && t.type === "expense")
    .reduce((acc, t) => acc + parseFloat(t.amount), 0)
    .toFixed(2);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.message, { color: theme.text }]}>
        {t("please_choose_farm")}
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

      {selectedFarm ? (
        <>
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.cardBackground,
                shadowColor: theme.shadowColor,
              },
            ]}
          >
            <Text style={[styles.summaryTitle, { color: theme.primary }]}>
              {t("farm")}: {selectedFarm}
            </Text>
            <View style={styles.summaryContent}>
              <Text style={[styles.summaryText, { color: theme.primary }]}>
                {t("total_income")}:{" "}
              </Text>
              <Text style={[styles.summaryAmount, { color: "green" }]}>
                Rs.{totalIncome}
              </Text>
            </View>
            <View style={styles.summaryContent}>
              <Text style={[styles.summaryText, { color: theme.primary }]}>
                {t("total_expenses")}:{" "}
              </Text>
              <Text style={[styles.summaryAmount, { color: "red" }]}>
                Rs.{totalExpenses}
              </Text>
            </View>
          </View>

          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === "all"
                  ? { backgroundColor: theme.primary }
                  : { backgroundColor: theme.buttonBackground },
              ]}
              onPress={() => setFilterType("all")}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText }]}>
                {t("all")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === "income"
                  ? { backgroundColor: theme.primary }
                  : { backgroundColor: theme.buttonBackground },
              ]}
              onPress={() => setFilterType("income")}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText }]}>
                {t("income")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === "expense"
                  ? { backgroundColor: theme.primary }
                  : { backgroundColor: theme.buttonBackground },
              ]}
              onPress={() => setFilterType("expense")}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText }]}>
                {t("expense")}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.transaction,
                  {
                    backgroundColor: theme.cardBackground,
                    shadowColor: theme.shadowColor,
                  },
                ]}
              >
                <View style={styles.transactionDetails}>
                  <Text style={[styles.transactionText, { color: theme.text }]}>
                    {item.description}
                  </Text>
                  <Text style={[styles.transactionDate, { color: theme.text }]}>
                    {item.date}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: item.type === "income" ? "green" : "red" },
                  ]}
                >
                  {item.type === "income" ? "+" : "-"}Rs.{item.amount}
                </Text>
              </View>
            )}
            style={styles.transactionList}
          />
        </>
      ) : (
        <Image
          source={require("../../assets/chick_finance.png")}
          style={styles.placeholderImage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  picker: {
    marginBottom: 24,
    padding: 12,
    borderRadius: 8,
    elevation: 3,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  summaryContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  summaryText: {
    fontSize: 18,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionList: {
    marginTop: 16,
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  transactionDetails: {
    flexDirection: "column",
  },
  transactionText: {
    fontSize: 16,
    marginBottom: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionDate: {
    fontSize: 14,
  },
  placeholderImage: {
    width: "100%",
    height: "50%",
    resizeMode: "contain",
    marginTop: 120,
  },
  message: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default FinanceScreen;
