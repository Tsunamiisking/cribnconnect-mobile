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
  
  // Helper function to convert ISO string to date picker format (YYYY/MM/DD)
  const formatDateForPicker = (dateValue) => {
    if (!dateValue) return "";
    
    try {
      // If it's already in YYYY/MM/DD format, return as is
      if (typeof dateValue === 'string' && dateValue.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
        return dateValue;
      }
      
      // If it's an ISO string, convert it
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "";
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}/${month}/${day}`;
    } catch (error) {
      console.warn('Error formatting date for picker:', error);
      return "";
    }
  };
  
  const [selectedDate, setSelectedDate] = useState(formatDateForPicker(eventData.date));
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

  // Sync with store data when navigating back to this step
  useEffect(() => {
    const formattedDate = formatDateForPicker(eventData.date);
    if (formattedDate !== selectedDate) {
      setSelectedDate(formattedDate);
    }
    if (eventData.time !== selectedTime) {
      setSelectedTime(eventData.time || "");
    }
    if (eventData.endTime !== selectedEndTime) {
      setSelectedEndTime(eventData.endTime || "");
    }
  }, [eventData.date, eventData.time, eventData.endTime]);

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
      try {
        // Convert YYYY/MM/DD to Date object for backend
        const [year, month, day] = selectedDate.split('/');
        
        // Validate date components
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        const dayNum = parseInt(day);
        
        if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum) || 
            monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
          console.warn('Invalid date components:', { year: yearNum, month: monthNum, day: dayNum });
          return;
        }
        
        const dateObj = new Date(yearNum, monthNum - 1, dayNum);
        
        // Check if the date is valid
        if (isNaN(dateObj.getTime())) {
          console.warn('Invalid date object created:', dateObj);
          return;
        }
        
        updateEventData('date', dateObj.toISOString());
      } catch (error) {
        console.error('Error processing date:', error, 'selectedDate:', selectedDate);
      }
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
              current={(() => {
                try {
                  if (selectedDate) {
                    // Validate the selectedDate format
                    const [year, month, day] = selectedDate.split('/');
                    if (year && month && day && !isNaN(year) && !isNaN(month) && !isNaN(day)) {
                      return selectedDate;
                    }
                  }
                  // Fallback to current date if selectedDate is invalid
                  return new Date().toISOString().split("T")[0].replace(/-/g, "/");
                } catch (error) {
                  console.warn('Error with date formatting:', error);
                  return new Date().toISOString().split("T")[0].replace(/-/g, "/");
                }
              })()}
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
