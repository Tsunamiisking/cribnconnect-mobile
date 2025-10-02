import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import useHostingStore from "@/stores/hostingStore";

export default function EventTicket({ styles }) {
  const { eventData, updateEventNestedData } = useHostingStore();
  const [selected, setSelected] = useState([]); // multiple selections
  const [ticketData, setTicketData] = useState({}); // store form data for each ticket type

  // Initialize from store data
  useEffect(() => {
    if (eventData.ticket) {
      if (eventData.ticket.isFree) {
        setSelected(['free']);
      }
      // You could add more initialization logic here for other ticket types
    }
  }, []);

  // Update store when ticket data changes
  useEffect(() => {
    updateEventNestedData('ticket', 'isFree', selected.includes('free'));
    if (selected.includes('free')) {
      updateEventNestedData('ticket', 'price', '0');
    } else {
      // Handle paid tickets - for now, we'll use the first non-free ticket price
      const paidTickets = selected.filter(s => s !== 'free');
      if (paidTickets.length > 0) {
        const firstPaidTicket = paidTickets[0];
        const price = ticketData[firstPaidTicket]?.price || '';
        updateEventNestedData('ticket', 'price', price);
      }
    }
  }, [selected, ticketData]);

  const formatNaira = (amount) => {
    if (!amount || isNaN(amount)) return "";
    const num = parseFloat(amount.replace(/,/g, ""));
    return `₦${num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleInputChange = (type, field, value) => {
    setTicketData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));

    // Update capacity in store if it's the capacity field
    if (field === 'maxTickets') {
      updateEventNestedData('ticket', 'capacity', value);
    }
  };

  const renderTicketCategories = (ticketType) => {
    const data = ticketData[ticketType] || {
      price: "",
      maxTickets: "",
      maxPerPerson: "",
    };

    return (
      <View className="mt-6" key={ticketType}>
        <Text style={[styles.label, { fontFamily: "Sora-Bold" }]}>
          {ticketType}
        </Text>
        <Text style={styles.typeOptionDescription}>
          Set {ticketType} ticket price
        </Text>
        <TextInput
          onChangeText={(val) => handleInputChange(ticketType, "price", val)}
          value={data.price}
          placeholder="Enter price"
          keyboardType="numeric"
          style={styles.input}
        />
        <Text style={styles.typeOptionDescription}>
          {`${ticketType} ticket price is ${
            data.price ? formatNaira(data.price) : formatNaira("0")
          } / per person`}
        </Text>

        <View className="mt-4">
          <Text style={styles.labelText}>
            Max {ticketType} tickets Available
          </Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            onChangeText={(val) =>
              handleInputChange(ticketType, "maxTickets", val)
            }
            value={data.maxTickets}
            placeholder={`Enter max ${ticketType} tickets`}
          />
        </View>

        <View className="mt-4">
          <Text style={styles.labelText}>Max tickets per person</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            onChangeText={(val) =>
              handleInputChange(ticketType, "maxPerPerson", val)
            }
            value={data.maxPerPerson}
            placeholder="Enter max tickets per person"
          />
        </View>
      </View>
    );
  };

  const ticketOptions = [
    { key: "free", label: "Free (Mark event access as FREE)" },
    { key: "student", label: "Student" },
    { key: "regular", label: "Regular" },
    { key: "vip", label: "VIP" },
    { key: "vvip", label: "VVIP" },
  ];

  const toggleSelection = (key) => {
    setSelected((prev) => {
      if (key === "free") {
        // Selecting free clears all others
        return prev.includes("free") ? [] : ["free"];
      } else {
        // If free is already selected, clear it before adding others
        if (prev.includes("free")) {
          return [key];
        }
        // Toggle other tickets normally
        return prev.includes(key)
          ? prev.filter((k) => k !== key)
          : [...prev, key];
      }
    });
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>How can people access your event?</Text>
      <Text style={styles.sectionSubtitle}>Select Ticket Access Type</Text>

      <View className="mt-6">
        {ticketOptions.map((option) => (
          <View key={option.key} className="flex-row items-center">
            <TouchableOpacity
              onPress={() => toggleSelection(option.key)}
              className={`w-10 h-10 border-[#e5e7eb] border-2 rounded-lg items-center justify-center mt-4 mr-4 ${
                selected.includes(option.key) ? "bg-[#274046]" : "bg-white"
              }`}
            />
            <Text style={[styles.labelText, { marginTop: 14 }]}>
              {option.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Render multiple ticket forms (skip free) */}
      {selected
        .filter((s) => s !== "free")
        .map((type) =>
          renderTicketCategories(type.charAt(0).toUpperCase() + type.slice(1))
        )}
    </View>
  );
}
