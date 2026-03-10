import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { XCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { scanResultStyles as styles } from './scanResultStyles';

const ErrorResult = ({ message, onReset }) => {
  return (
    <View style={styles.resultContent}>
      <View style={styles.resultHeader}>
        <View style={[styles.resultIcon, styles.errorIcon]}>
          <XCircle size={48} color={Colors.white} />
        </View>
        <Text style={styles.resultTitle}>Scan Failed ❌</Text>
        <Text style={styles.resultSubtitle}>{message}</Text>
      </View>

      <View style={[styles.resultCard, styles.errorCard]}>
        <Text style={styles.errorMessage}>{message}</Text>
        <Text style={styles.errorHint}>
          Please verify the QR code and try again, or contact support if the issue persists.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.resetButton, styles.errorButton]}
        onPress={onReset}
      >
        <Text style={styles.resetButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorResult;
