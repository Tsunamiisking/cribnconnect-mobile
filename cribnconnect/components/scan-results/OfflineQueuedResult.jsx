import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { scanResultStyles as styles } from './scanResultStyles';

const OfflineQueuedResult = ({ ticketCode, onReset }) => {
  return (
    <View style={styles.resultContent}>
      <View style={styles.resultHeader}>
        <View style={[styles.resultIcon, styles.infoIcon]}>
          <WifiOff size={48} color={Colors.white} />
        </View>
        <Text style={styles.resultTitle}>Queued for Sync 📥</Text>
        <Text style={styles.resultSubtitle}>Scan saved - will sync when online</Text>
      </View>

      <View style={[styles.resultCard, styles.infoCard]}>
        <Text style={styles.offlineQueueMessage}>
          You're currently offline. This ticket scan has been saved locally and will be automatically synced when you reconnect to the internet.
        </Text>
        <View style={styles.ticketCodeContainer}>
          <Text style={styles.ticketCodeLabel}>Ticket Code:</Text>
          <Text style={styles.ticketCodeValue}>{ticketCode}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.resetButton, styles.infoButton]}
        onPress={onReset}
      >
        <Text style={styles.resetButtonText}>Scan Next Ticket</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OfflineQueuedResult;
