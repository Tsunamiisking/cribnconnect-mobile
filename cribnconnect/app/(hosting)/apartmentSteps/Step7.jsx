import { Colors } from "@/constants/Colors";
import useHostingStore from "@/stores/hostingStore";
import { Calendar, DollarSign, X } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import DatePicker from 'react-native-modern-datepicker';

export default function Step7({ styles }) {
  const { apartmentData, updateApartmentData, updateApartmentNestedData } = useHostingStore();
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedToDate, setSelectedToDate] = useState('');

  const handlePricePerNightChange = (value) => {
    updateApartmentData('pricePerNight', value);
  };

  const handlePricePerWeekChange = (value) => {
    updateApartmentData('pricePerWeek', value);
  };

  // Helper to format price with naira sign, commas, and .00
  const formatNaira = (amount) => {
    if (!amount || isNaN(amount)) return "";
    const num = parseFloat(amount.replace(/,/g, ""));
    return `₦${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Select Date";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handle date changes - onSelectedChange is required by the Calendar component
  const handleFromSelectedChange = (dateString) => {
    // Only update if the date actually changed to prevent infinite loops
    if (dateString !== selectedFromDate) {
      setSelectedFromDate(dateString);
    }
  };

  const handleFromDateChange = (dateString) => {
    setSelectedFromDate(dateString);
    setShowFromDatePicker(false);
    
    // Update store
    const [year, month, day] = dateString.split('/');
    const date = new Date(year, month - 1, day);
    updateApartmentNestedData('availability', 'from', date);
  };

  const handleToSelectedChange = (dateString) => {
    // Only update if the date actually changed to prevent infinite loops
    if (dateString !== selectedToDate) {
      setSelectedToDate(dateString);
    }
  };

  const handleToDateChange = (dateString) => {
    setSelectedToDate(dateString);
    setShowToDatePicker(false);
    
    // Update store
    const [year, month, day] = dateString.split('/');
    const date = new Date(year, month - 1, day);
    updateApartmentNestedData('availability', 'to', date);
  };

  // Get today's date in YYYY/MM/DD format for DatePicker
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // Convert Date to YYYY/MM/DD format for DatePicker
  const dateToString = (date) => {
    if (!date) return getTodayString();
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Pricing & Availability</Text>
      <Text style={styles.sectionSubtitle}>Set your pricing and availability period</Text>

      {/* Pricing Section */}
      <View style={{ marginBottom: 32 }}>
        <Text style={[styles.label, { marginBottom: 20 }]}>Pricing</Text>
        
        {/* Price Per Night */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.labelText, { marginBottom: 8 }]}>Amount Per Night *</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 60,
            borderWidth: 1,
            borderColor: Colors.borderColor,
            borderRadius: 12,
            paddingHorizontal: 16,
            backgroundColor: '#f9fafb',
          }}>
            {/* <DollarSign size={20} color={Colors.primary} style={{ marginRight: 8 }} /> */}
            <Text style={{ 
              fontFamily: 'Sora-Medium', 
              fontSize: 18, 
              color: Colors.primary,
              marginRight: 8
            }}>₦</Text>
            <TextInput
              style={{
                flex: 1,
                fontFamily: 'Sora-Regular',
                fontSize: 16,
                color: Colors.primary,
                padding: 0,
              }}
              placeholder="5000"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={apartmentData.pricePerNight || ""}
              onChangeText={handlePricePerNightChange}
            />
          </View>
          {apartmentData.pricePerNight && (
            <Text style={[styles.typeOptionDescription, { marginTop: 8, marginLeft: 4 }]}>
              {formatNaira(apartmentData.pricePerNight)} per night
            </Text>
          )}
        </View>

        {/* Divider */}
        <View style={{ marginVertical: 16, position: 'relative', justifyContent: 'center', alignItems: 'center', height: 24 }}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: '#e5e7eb' }} />
          <View style={{ backgroundColor: '#fff', paddingHorizontal: 12 }}>
            <Text style={[styles.typeOptionDescription]}>Optional</Text>
          </View>
        </View>

        {/* Price Per Week */}
        <View>
          <Text style={[styles.labelText, { marginBottom: 8 }]}>Amount Per Week (Optional)</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 60,
            borderWidth: 1,
            borderColor: Colors.borderColor,
            borderRadius: 12,
            paddingHorizontal: 16,
            backgroundColor: '#f9fafb',
          }}>
            {/* <DollarSign size={20} color={Colors.primary} style={{ marginRight: 8 }} /> */}
            <Text style={{ 
              fontFamily: 'Sora-Medium', 
              fontSize: 18, 
              color: Colors.primary,
              marginRight: 8
            }}>₦</Text>
            <TextInput
              style={{
                flex: 1,
                fontFamily: 'Sora-Regular',
                fontSize: 16,
                color: Colors.primary,
                padding: 0,
              }}
              placeholder="30000"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={apartmentData.pricePerWeek || ""}
              onChangeText={handlePricePerWeekChange}
            />
          </View>
          {apartmentData.pricePerWeek && (
            <Text style={[styles.typeOptionDescription, { marginTop: 8, marginLeft: 4 }]}>
              {formatNaira(apartmentData.pricePerWeek)} per week
            </Text>
          )}
        </View>
      </View>

      {/* Availability Dates */}
      <View>
        <Text style={[styles.label, { marginBottom: 20 }]}>Availability Period</Text>
        
        {/* From Date */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.labelText, { marginBottom: 8 }]}>Available From *</Text>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 60,
              borderWidth: 1,
              borderColor: Colors.borderColor,
              borderRadius: 12,
              paddingHorizontal: 16,
              backgroundColor: '#f9fafb',
            }}
            onPress={() => setShowFromDatePicker(true)}
          >
            <Calendar size={20} color={Colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ 
              fontFamily: 'Sora-Regular', 
              fontSize: 16, 
              color: apartmentData.availability?.from ? Colors.primary : '#9ca3af' 
            }}>
              {formatDate(apartmentData.availability?.from)}
            </Text>
          </Pressable>
        </View>

        {/* To Date (Optional) */}
        <View>
          <Text style={[styles.labelText, { marginBottom: 8 }]}>Available Until (Optional)</Text>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 60,
              borderWidth: 1,
              borderColor: Colors.borderColor,
              borderRadius: 12,
              paddingHorizontal: 16,
              backgroundColor: '#f9fafb',
            }}
            onPress={() => setShowToDatePicker(true)}
          >
            <Calendar size={20} color={Colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ 
              fontFamily: 'Sora-Regular', 
              fontSize: 16, 
              color: apartmentData.availability?.to ? Colors.primary : '#9ca3af' 
            }}>
              {formatDate(apartmentData.availability?.to)}
            </Text>
          </Pressable>
          <Text style={[styles.typeOptionDescription, { marginTop: 8, marginLeft: 4 }]}>
            Leave empty if available indefinitely
          </Text>
        </View>

        {/* Date Pickers */}
        <Modal
          visible={showFromDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,
              width: '90%',
              maxWidth: 400,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={[styles.label]}>Select Start Date</Text>
                <Pressable onPress={() => setShowFromDatePicker(false)}>
                  <X size={24} color={Colors.primary} />
                </Pressable>
              </View>
              <DatePicker
                mode="calendar"
                isGregorian={true}
                minimumDate={getTodayString()}
                selected={selectedFromDate || dateToString(apartmentData.availability?.from)}
                onSelectedChange={handleFromSelectedChange}
                onDateChange={handleFromDateChange}
                options={{
                  backgroundColor: 'white',
                  textHeaderColor: Colors.primary,
                  textDefaultColor: Colors.primary,
                  selectedTextColor: '#fff',
                  mainColor: Colors.primary,
                  textSecondaryColor: '#6b7280',
                }}
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={showToDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,
              width: '90%',
              maxWidth: 400,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={[styles.label]}>Select End Date</Text>
                <Pressable onPress={() => setShowToDatePicker(false)}>
                  <X size={24} color={Colors.primary} />
                </Pressable>
              </View>
              <DatePicker
                mode="calendar"
                isGregorian={true}
                minimumDate={dateToString(apartmentData.availability?.from) || getTodayString()}
                selected={selectedToDate || dateToString(apartmentData.availability?.to)}
                onSelectedChange={handleToSelectedChange}
                onDateChange={handleToDateChange}
                options={{
                  backgroundColor: 'white',
                  textHeaderColor: Colors.primary,
                  textDefaultColor: Colors.primary,
                  selectedTextColor: '#fff',
                  mainColor: Colors.primary,
                  textSecondaryColor: '#6b7280',
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
