import useHostingStore from "@/stores/hostingStore";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import DatePicker from "react-native-modern-datepicker";
// Fix for displayName error in react-native-modern-datepicker
if (!DatePicker.displayName) {
  DatePicker.displayName = "DatePicker";
}

export default function EventDate({ styles }) {
  const { eventData, updateEventData } = useHostingStore();
  const [selectedDate, setSelectedDate] = useState(eventData.date || "");
  const [selectedTime, setSelectedTime] = useState(eventData.time || "");
  const [selectedEndTime, setSelectedEndTime] = useState(eventData.endTime || "");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Time state for start time
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [startPeriod, setStartPeriod] = useState("AM");

  // Time state for end time
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [endPeriod, setEndPeriod] = useState("AM");

  // Parse existing time strings when component mounts
  useEffect(() => {
    if (selectedTime) {
      const parsedTime = parseTimeString(selectedTime);
      if (parsedTime) {
        setStartHour(parsedTime.hour);
        setStartMinute(parsedTime.minute);
        setStartPeriod(parsedTime.period);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedEndTime) {
      const parsedTime = parseTimeString(selectedEndTime);
      if (parsedTime) {
        setEndHour(parsedTime.hour);
        setEndMinute(parsedTime.minute);
        setEndPeriod(parsedTime.period);
      }
    }
  }, []);

  // Helper function to parse time string like "2:30 PM"
  const parseTimeString = (timeStr) => {
    if (!timeStr) return null;
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (match) {
      return {
        hour: match[1],
        minute: match[2],
        period: match[3].toUpperCase()
      };
    }
    return null;
  };

  // Helper function to format time
  const formatTime = (hour, minute, period) => {
    if (!hour || !minute || !period) return "";
    return `${hour}:${minute} ${period}`;
  };

  // Update start time when components change
  useEffect(() => {
    const timeString = formatTime(startHour, startMinute, startPeriod);
    if (timeString && timeString !== selectedTime) {
      setSelectedTime(timeString);
      updateEventData('time', timeString);
    }
  }, [startHour, startMinute, startPeriod]);

  // Update end time when components change
  useEffect(() => {
    const timeString = formatTime(endHour, endMinute, endPeriod);
    if (timeString && timeString !== selectedEndTime) {
      setSelectedEndTime(timeString);
      updateEventData('endTime', timeString);
    }
  }, [endHour, endMinute, endPeriod]);

  // Update store when date changes
  useEffect(() => {
    if (selectedDate) {
      // Convert YYYY/MM/DD to Date object for backend
      const [year, month, day] = selectedDate.split('/');
      const dateObj = new Date(year, month - 1, day);
      updateEventData('date', dateObj.toISOString());
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Don't close immediately, let user confirm selection
  };

  const handleMonthYearChange = (date) => {
    // Handle month/year changes if needed
    console.log('Month/Year changed:', date);
  };

  const handleOnDateChange = (date) => {
    // This handles individual date selection
    setSelectedDate(date);
    // Close picker after selection
    setTimeout(() => {
      setShowDatePicker(false);
    }, 300);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Select Date";

    try {
      // Convert YYYY/MM/DD to readable format
      const [year, month, day] = dateString.split("/");
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Time input component
  const renderTimeInput = (title, hour, minute, period, setHour, setMinute, setPeriod) => (
    <View className="mt-6">
      <Text style={styles.label}>{title}</Text>
      <View style={localStyles.timeInputContainer}>
        <TextInput
          style={localStyles.timeInput}
          value={hour}
          onChangeText={(text) => {
            // Only allow numbers 1-12
            const num = parseInt(text);
            if (text === "" || (num >= 1 && num <= 12)) {
              setHour(text);
            }
          }}
          placeholder="HH"
          keyboardType="numeric"
          maxLength={2}
        />
        <Text style={localStyles.timeSeparator}>:</Text>
        <TextInput
          style={localStyles.timeInput}
          value={minute}
          onChangeText={(text) => {
            // Only allow numbers 00-59
            if (text === "") {
              setMinute("");
            } else {
              const num = parseInt(text);
              if (!isNaN(num) && num >= 0 && num <= 59) {
                setMinute(text.length === 1 ? text : text.padStart(2, '0'));
              }
            }
          }}
          placeholder="MM"
          keyboardType="numeric"
          maxLength={2}
        />
        <View style={localStyles.periodContainer}>
          <TouchableOpacity
            style={[
              localStyles.periodButton,
              period === "AM" && localStyles.selectedPeriod
            ]}
            onPress={() => setPeriod("AM")}
          >
            <Text style={[
              localStyles.periodText,
              period === "AM" && localStyles.selectedPeriodText
            ]}>AM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              localStyles.periodButton,
              period === "PM" && localStyles.selectedPeriod
            ]}
            onPress={() => setPeriod("PM")}
          >
            <Text style={[
              localStyles.periodText,
              period === "PM" && localStyles.selectedPeriodText
            ]}>PM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>When is your event?</Text>
      <Text style={styles.sectionSubtitle}>
        Select the date and time for your event
      </Text>

      {/* Date Selection */}
      <View className="mt-6">
        <Text style={styles.label}>Event Date</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: "center" }]}
          onPress={() => setShowDatePicker(!showDatePicker)}
        >
          <Text
            style={[
              styles.labelText,
              { color: selectedDate ? "#274046" : "#B0B0B0" },
            ]}
          >
            {formatDisplayDate(selectedDate)}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <View style={localStyles.datePickerContainer}>
            <DatePicker
              onSelectedChange={handleDateChange}
              onMonthYearChange={handleMonthYearChange}
              onDateChange={handleOnDateChange}
              selected={selectedDate}
              current={selectedDate || new Date().toISOString().split("T")[0].replace(/-/g, "/")}
              mode="calendar"
              isGregorian={true}
              minimumDate={new Date()
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "/")}
              style={localStyles.datePicker}
              options={{
                backgroundColor: "#ffffff",
                textHeaderColor: "#274046",
                textDefaultColor: "#274046",
                selectedTextColor: "#ffffff",
                mainColor: "#274046",
                textSecondaryColor: "#6b7280",
                borderColor: "transparent",
                textFontSize: 15,
                textHeaderFontSize: 17,
                defaultFont: "Sora-Regular",
                headerFont: "Sora-Medium",
              }}
            />
            <TouchableOpacity
              style={localStyles.closeDatePickerButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={localStyles.closeDatePickerText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Start Time */}
      {renderTimeInput(
        "Start Time",
        startHour,
        startMinute,
        startPeriod,
        setStartHour,
        setStartMinute,
        setStartPeriod
      )}

      {/* End Time */}
      {renderTimeInput(
        "End Time",
        endHour,
        endMinute,
        endPeriod,
        setEndHour,
        setEndMinute,
        setEndPeriod
      )}

      {/* Duration Display */}
      {selectedTime && selectedEndTime && (
        <View className="mt-4">
          <Text style={styles.typeOptionDescription}>
            Event Duration: {selectedTime} - {selectedEndTime}
          </Text>
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  datePickerContainer: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: 16,
  },
  datePicker: {
    borderRadius: 12,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  timeInput: {
    width: 50,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Sora-Regular",
    color: "#274046",
    padding: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#f9fafb",
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#274046",
    marginHorizontal: 8,
  },
  periodContainer: {
    flexDirection: "row",
    marginLeft: 16,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginHorizontal: 2,
  },
  selectedPeriod: {
    backgroundColor: "#274046",
    borderColor: "#274046",
  },
  periodText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: "#374151",
  },
  selectedPeriodText: {
    color: "#ffffff",
    fontFamily: "Sora-Medium",
  },
  closeDatePickerButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#274046",
    borderRadius: 8,
    alignItems: "center",
  },
  closeDatePickerText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Sora-Medium",
  },
});
