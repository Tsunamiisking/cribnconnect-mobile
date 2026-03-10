import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AlertCircle, User, XCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { scanResultStyles as styles } from './scanResultStyles';

const AlreadyScannedResult = ({ data, onReset }) => {
  const { attendeeInfo, scannedAt, scannedBy, isOffline } = data;

  return (
    <ScrollView 
      style={styles.resultContent} 
      contentContainerStyle={styles.resultScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.resultHeader}>
        <View style={[styles.resultIcon, styles.warningIcon]}>
          <AlertCircle size={48} color={Colors.white} />
        </View>
        <Text style={styles.resultTitle}>Already Scanned ⚠️</Text>
        <Text style={styles.resultSubtitle}>
          {isOffline 
            ? 'This ticket was already scanned (offline mode)' 
            : 'This ticket was already used'}
        </Text>
      </View>

      {attendeeInfo && attendeeInfo.name !== 'Unknown' && (
        <View style={styles.resultCard}>
          <View style={styles.cardHeader}>
            <User size={20} color={Colors.warning} />
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

          {attendeeInfo.ticketType && attendeeInfo.ticketType !== 'Unknown' && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ticket Type:</Text>
              <View style={[styles.ticketTypeBadge, styles.warningBadge]}>
                <Text style={styles.ticketTypeText}>{attendeeInfo.ticketType}</Text>
              </View>
            </View>
          )}
        </View>
      )}

      <View style={[styles.resultCard, styles.warningCard]}>
        <View style={styles.cardHeader}>
          <XCircle size={20} color={Colors.warning} />
          <Text style={styles.cardTitle}>Previous Scan</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Scanned By:</Text>
          <Text style={styles.infoValue}>{scannedBy}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Scanned At:</Text>
          <Text style={styles.infoValue}>
            {new Date(scannedAt).toLocaleString()}
          </Text>
        </View>

        {isOffline && (
          <View style={styles.offlineWarningContainer}>
            <Text style={styles.offlineWarningText}>
              ℹ️ Limited information available in offline mode
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.resetButton, styles.warningButton]}
        onPress={onReset}
      >
        <Text style={styles.resetButtonText}>Scan Next Ticket</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AlreadyScannedResult;
