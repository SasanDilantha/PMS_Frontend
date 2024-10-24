import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "../../theme/ThemeContext";
import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook
import { BASE_URL } from "../../services/bas_url";

const ReportScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation(); // Initialize the translation hook
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [analysisDetails, setAnalysisDetails] = useState([]);
  const [farmDetails, setFarmDetails] = useState([]);
  const [items, setItems] = useState([
    allFarms.map((farm) => ({
      label: farmDetails.farm_name,
      value: farmDetails.farm_code,
    })),
  ]); // set farms for deopdown

  // get all farms
  useEffect(() => {
    const getAllFarms = async () => {
      try {
        console.log("Fetching farms...");
        const response = await axios.get(BASE_URL + ":8222/api/farm");
        setFarmDetails(response.data);
        console.log("Farms fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    getAllFarms();
  }, []);

  // get analysis data
  useEffect(() => {
    const anData = async () => {
      try {
        const response = await axios.get(
          BASE_URL + ":8222/api/moni/get/all/data/1"
        );
        setAnalysisDetails(response.data);
        console.log("Farms fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    anData();
  }, []);

  const [collapsedSections, setCollapsedSections] = useState({
    farmDetails: true,
    analysis: true,
  });

  const toggleSection = (section) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const renderFarmDetail = ({ item }) => (
    <View
      style={[
        styles.sectionContainer,
        { backgroundColor: theme.cardBackground },
      ]}
    >
      <TouchableOpacity
        onPress={() => toggleSection("farmDetails")}
        style={styles.sectionHeader}
      >
        <Text style={[styles.title, { color: theme.primary }]}>
          {t("farm_details")}
        </Text>
        <Icon
          name={collapsedSections.farmDetails ? "chevron-down" : "chevron-up"}
          size={24}
          color={theme.primary}
        />
      </TouchableOpacity>
      <Collapsible collapsed={collapsedSections.farmDetails}>
        <View style={styles.sectionContent}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableLabel, { color: theme.text }]}>
              {t("farm_id")}
            </Text>
            <Text style={[styles.tableValue, { color: theme.text }]}>
              {item.farmId}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableLabel, { color: theme.text }]}>
              {t("farm_name")}
            </Text>
            <Text style={[styles.tableValue, { color: theme.text }]}>
              {item.farmName}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableLabel, { color: theme.text }]}>
              {t("location")}
            </Text>
            <Text style={[styles.tableValue, { color: theme.text }]}>
              {item.location}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableLabel, { color: theme.text }]}>
              {t("inventory_id")}
            </Text>
            <Text style={[styles.tableValue, { color: theme.text }]}>
              {item.inventoryId}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableLabel, { color: theme.text }]}>
              {t("begin_inventory_count")}
            </Text>
            <Text style={[styles.tableValue, { color: theme.text }]}>
              {item.beginInventoryCount}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableLabel, { color: theme.text }]}>
              {t("available_inventory_count")}
            </Text>
            <Text style={[styles.tableValue, { color: theme.text }]}>
              {item.availableInventoryCount}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableLabel, { color: theme.text }]}>
              {t("chick_age")}
            </Text>
            <Text style={[styles.tableValue, { color: theme.text }]}>
              {item.chickAge} weeks
            </Text>
          </View>
        </View>
      </Collapsible>

      <TouchableOpacity
        onPress={() => toggleSection("analysis")}
        style={styles.sectionHeader}
      >
        <Text style={[styles.title, { color: theme.primary }]}>
          {t("analysis")}
        </Text>
        <Icon
          name={collapsedSections.analysis ? "chevron-down" : "chevron-up"}
          size={24}
          color={theme.primary}
        />
      </TouchableOpacity>
      <Collapsible collapsed={collapsedSections.analysis}>
        <View style={styles.sectionContent}>
          {analysisDetails
            .filter((analysis) => analysis.farmName === item.farmName)
            .map((analysis, index) => (
              <View key={index}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableLabel, { color: theme.text }]}>
                    {t("weight_gain")}
                  </Text>
                  <Text style={[styles.tableValue, { color: theme.text }]}>
                    {analysis.weightGain} kg
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableLabel, { color: theme.text }]}>
                    {t("mortality_rate")}
                  </Text>
                  <Text style={[styles.tableValue, { color: theme.text }]}>
                    {analysis.mortalityRate}%
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableLabel, { color: theme.text }]}>
                    {t("feed_conversion_ratio")}
                  </Text>
                  <Text style={[styles.tableValue, { color: theme.text }]}>
                    {analysis.feedConversionRatio}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableLabel, { color: theme.text }]}>
                    {t("predicted_weight_feed_flock")}
                  </Text>
                  <Text style={[styles.tableValue, { color: theme.text }]}>
                    {analysis.predictedWeightBasedOnFeedInFlock} kg
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableLabel, { color: theme.text }]}>
                    {t("predicted_weight_adg_bird")}
                  </Text>
                  <Text style={[styles.tableValue, { color: theme.text }]}>
                    {analysis.predictedWeightBasedOnADGPerBird} kg
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </Collapsible>
    </View>
  );

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
          <FlatList
            data={farmDetails.filter((farm) => farm.farmName === selectedFarm)}
            renderItem={renderFarmDetail}
            keyExtractor={(item) => item.farmId.toString()}
          />
        </>
      ) : (
        <Image
          source={require("../../assets/chick_report.png")}
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
  sectionContainer: {
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
  },
  sectionContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  tableLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tableValue: {
    fontSize: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  placeholderImage: {
    width: "100%",
    height: "50%",
    resizeMode: "contain",
    marginTop: 120,
  },
});

export default ReportScreen;
