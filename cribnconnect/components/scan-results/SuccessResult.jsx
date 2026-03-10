import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircle, Ticket, User } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { scanResultStyles as styles } from './scanResultStyles';

const SuccessResult = ({ data, onReset }) => {
  const { attendeeInfo, scanInfo, eventInfo } = data;

  return (
    <ScrollView 
      style={styles.resultContent} 
      contentContainerStyle={styles.resultScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.resultHeader}>
        <View style={[styles.resultIcon, styles.successIcon]}>
          <CheckCircle size={48} color={Colors.white} />
        </View>
        <Text style={styles.resultTitle}>Valid Ticket ✅</Text>
        <Text style={styles.resultSubtitle}>Entry Approved</Text>
      </View>

      <View style={styles.resultCard}>
        <View style={styles.cardHeader}>
          <User size={20} color={Colors.primary} />
          <Text style={styles.cardTitle}>Attendee Information</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{attendeeInfo.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValueSmall}>{attendeeInfo.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ticket Type:</Text>
          <View style={styles.ticketTypeBadge}>
            <Text style={styles.ticketTypeText}>{attendeeInfo.ticketType}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ticket Number:</Text>
          <Text style={styles.infoValue}>
            #{attendeeInfo.ticketNumber} of {attendeeInfo.totalTickets}
          </Text>
        </View>
      </View>

      <View style={styles.resultCard}>
        <View style={styles.cardHeader}>
          <Ticket size={20} color={Colors.primary} />
          <Text style={styles.cardTitle}>Scan Information</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Scanned By:</Text>
          <Text style={styles.infoValue}>{scanInfo.scannedBy}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Time:</Text>
          <Text style={styles.infoValue}>
            {new Date(scanInfo.scannedAt).toLocaleString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Method:</Text>
          <Text style={styles.infoValue}>{scanInfo.scanMethod}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={onReset}>
        <Text style={styles.resetButtonText}>Scan Next Ticket</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SuccessResult;
