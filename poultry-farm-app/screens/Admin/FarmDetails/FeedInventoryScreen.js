import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../../theme/ThemeContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { BASE_URL } from "../../../services/bas_url";

const FeedInventoryScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [inventory, setInventory] = useState([]);

  // get all feed inventory details
  useEffect(() => {
    const allInventory = async () => {
      try {
        const response = await axios.get(
          BASE_URL + ":8222/api/feed/all/inventory/details"
        );
        setInventory(response.data);
        console.log("Inventory data:", response.data);
      } catch (error) {
        console.error("Error fetching inventory details:", error);
      }
    };

    allInventory();
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {inventory.map((inv) => (
        <View
          key={inv.feed_inventory_id}
          style={[
            styles.blockCard,
            {
              backgroundColor: theme.cardBackground,
              shadowColor: theme.shadowColor,
            },
          ]}
        >
          <Text style={[styles.blockTitle, { color: theme.primary }]}>
            {inv.feed_inventory_code}
          </Text>
          <View style={styles.feedDetails}>
            <View style={styles.detailRow}>
              <Icon
                name="food-apple"
                size={20}
                color={theme.iconColor}
                style={styles.icon}
              />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {t("feed_type")}: {inv.feed_type}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Icon
                name="cube-outline"
                size={20}
                color={theme.iconColor}
                style={styles.icon}
              />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {t("available_quantity")}: {inv.available_quantity} kg
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Icon
                name="currency-usd"
                size={20}
                color={theme.iconColor}
                style={styles.icon}
              />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {t("expense_value")}: {inv.expense_value}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Icon
                name="account"
                size={20}
                color={theme.iconColor}
                style={styles.icon}
              />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {t("supplier_name")}: {inv.supplier_name}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Icon
                name="phone"
                size={20}
                color={theme.iconColor}
                style={styles.icon}
              />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {t("supplier_mobile")}: {inv.supplier_mobile}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Icon
                name="calendar"
                size={20}
                color={theme.iconColor}
                style={styles.icon}
              />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {t("purchase_date")}: {inv.date}
              </Text>
            </View>
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
  blockCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
  },
  blockTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  feedDetails: {
    marginBottom: 16,
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
});

export default FeedInventoryScreen;
