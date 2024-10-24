import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../../theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../../services/bas_url";

const monitoringData = [
  {
    id: "1",
    temperature: "24",
    humidity: "55",
    ammoniaLevel: "20",
  },
];

const getPercentage = (value, max) => (value / max) * 100;

const MonitoringScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [sensorData, setSensorData] = useState([]);
  const [monitoringData, setMonitoringData] = useState([]);

  // get sensor details
  useEffect(() => {
    const getSensorData = async () => {
      try {
        const response = await axios.get(
          BASE_URL + ":8222//api/moni/get/iot/data"
        );
        const fetchedSensorData = response.data;

        // Find the latest sensor data entry (assuming data is sorted by timestamp or needs sorting)
        const latestSensor = fetchedSensorData.reduce((latest, current) =>
          new Date(current.timestamp) > new Date(latest.timestamp)
            ? current
            : latest
        );

        // Map the latest sensor data to the monitoringData format
        const latestMonitoringData = {
          id: latestSensor.id,
          temperature: latestSensor.temperature,
          humidity: latestSensor.humidity,
          ammoniaLevel: latestSensor.ammoniaLevel,
        };

        setSensorData(fetchedSensorData); // Store the raw sensor data
        setMonitoringData([latestMonitoringData]); // Set only the latest data in monitoringData

        console.log("Latest sensor data:", latestSensor);
        console.log("Mapped monitoring data:", latestMonitoringData);
      } catch (error) {
        console.error("Error fetching :", error);
      }
    };

    getSensorData();
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {monitoringData.map((block) => (
        <View
          key={block.id}
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              shadowColor: theme.shadowColor,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.primary }]}>
            ID: {block.id}
          </Text>

          <View style={styles.detailRow}>
            <Icon
              name="thermometer"
              size={20}
              color={theme.iconColor}
              style={styles.icon}
            />
            <Text style={[styles.detailText, { color: theme.text }]}>
              {t("temperature")}: {block.temperature} °C
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${getPercentage(block.temperature, 40)}%`,
                  backgroundColor: "coral",
                },
              ]}
            />
          </View>

          <View style={styles.detailRow}>
            <Icon
              name="water-percent"
              size={20}
              color={theme.iconColor}
              style={styles.icon}
            />
            <Text style={[styles.detailText, { color: theme.text }]}>
              {t("humidity")}: {block.humidity}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${getPercentage(block.humidity, 100)}%`,
                  backgroundColor: "deepskyblue",
                },
              ]}
            />
          </View>

          <View style={styles.detailRow}>
            <Icon
              name="chemical-weapon"
              size={20}
              color={theme.iconColor}
              style={styles.icon}
            />
            <Text style={[styles.detailText, { color: theme.text }]}>
              {t("ammonia_level")}: {block.ammoniaLevel} ppm
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${getPercentage(block.ammoniaLevel, 50)}%`,
                  backgroundColor: "darkorange",
                },
              ]}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 16,
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: "#d3d3d3",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  progressBar: {
    height: "100%",
    borderRadius: 10,
  },
});

export default MonitoringScreen;
