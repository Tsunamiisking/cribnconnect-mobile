import { scanTicket } from '@/api/services/ticketServices';
import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Ticket, User, XCircle, Camera as CameraIcon, AlertCircle } from 'lucide-react-native';
import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

const QrScanner = () => {
  const { eventId, eventTitle } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [torch, setTorch] = useState(false);
  
  // Animation values
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate scan line
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned || scanning) return;

    setScanned(true);
    setScanning(true);

    // Haptic feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      // Extract ticket code from URL or raw data
      let ticketCode = data;
      
      if (data.includes('/web-scan/')) {
        ticketCode = data.split('/web-scan/')[1];
      } else if (data.includes('/scan/')) {
        ticketCode = data.split('/scan/')[1];
      }

      console.log('🎫 Scanning ticket:', ticketCode);

      // Call API to scan ticket
      const response = await scanTicket(ticketCode, {
        scanMethod: 'in-app',
        scanLocation: 'Mobile App Scanner',
      });

      console.log('✅ Scan successful:', response);

      // Show success result
      showSuccessResult(response);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    } catch (error) {
      console.error('❌ Scan error:', error);

      if (error.response?.data?.alreadyUsed) {
        // Ticket already scanned
        showAlreadyScannedResult(error.response.data);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        // Other error
        const errorMessage = error.response?.data?.message || 'Failed to validate ticket';
        showErrorResult(errorMessage);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setScanning(false);
    }
  };

  const showSuccessResult = (data) => {
    setScanResult({
      type: 'success',
      data: data,
    });
    animateResult();
  };

  const showAlreadyScannedResult = (data) => {
    setScanResult({
      type: 'already-scanned',
      data: data,
    });
    animateResult();
  };

  const showErrorResult = (message) => {
    setScanResult({
      type: 'error',
      message: message,
    });
    animateResult();
  };

  const animateResult = () => {
    Animated.spring(resultOpacity, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const resetScanner = () => {
    Animated.timing(resultOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setScanned(false);
      setScanResult(null);
    });
  };

  const toggleTorch = () => {
    setTorch(!torch);
  };

  // Request permission if not granted
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="QR Scanner" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="QR Scanner" />
        <View style={styles.centerContent}>
          <CameraIcon size={64} color={Colors.gray400} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan ticket QR codes
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_AREA_SIZE - 4],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title={eventTitle || "QR Scanner"} />

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          enableTorch={torch}
        >
          {/* Overlay with scan area */}
          <View style={styles.overlay}>
            {/* Top overlay */}
            <View style={styles.overlayTop} />

            {/* Middle row with scan area */}
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              
              {/* Scan area */}
              <View style={styles.scanArea}>
                {/* Corner borders */}
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />

                {/* Animated scan line */}
                {!scanned && (
                  <Animated.View
                    style={[
                      styles.scanLine,
                      {
                        transform: [{ translateY: scanLineTranslateY }],
                      },
                    ]}
                  />
                )}
              </View>

              <View style={styles.overlaySide} />
            </View>

            {/* Bottom overlay with instructions */}
            <View style={styles.overlayBottom}>
              <View style={styles.instructionsContainer}>
                <Ticket size={24} color={Colors.white} />
                <Text style={styles.instructionText}>
                  {scanning ? 'Validating ticket...' : 'Align QR code within the frame'}
                </Text>
              </View>

              {/* Torch toggle */}
              <TouchableOpacity
                style={styles.torchButton}
                onPress={toggleTorch}
              >
                <Text style={styles.torchButtonText}>
                  {torch ? '🔦 Torch ON' : '🔦 Torch OFF'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>

        {/* Scan Result Overlay */}
        {scanResult && (
          <Animated.View
            style={[
              styles.resultOverlay,
              { opacity: resultOpacity },
            ]}
          >
            <View style={styles.resultContainer}>
              {scanResult.type === 'success' && (
                <SuccessResult data={scanResult.data} onReset={resetScanner} />
              )}
              {scanResult.type === 'already-scanned' && (
                <AlreadyScannedResult data={scanResult.data} onReset={resetScanner} />
              )}
              {scanResult.type === 'error' && (
                <ErrorResult message={scanResult.message} onReset={resetScanner} />
              )}
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

// Success Result Component
const SuccessResult = ({ data, onReset }) => {
  const { attendeeInfo, scanInfo, eventInfo } = data;

  return (
    <ScrollView style={styles.resultContent} showsVerticalScrollIndicator={false}>
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

// Already Scanned Result Component
const AlreadyScannedResult = ({ data, onReset }) => {
  const { attendeeInfo, scannedAt, scannedBy } = data;

  return (
    <ScrollView style={styles.resultContent} showsVerticalScrollIndicator={false}>
      <View style={styles.resultHeader}>
        <View style={[styles.resultIcon, styles.warningIcon]}>
          <AlertCircle size={48} color={Colors.white} />
        </View>
        <Text style={styles.resultTitle}>Already Scanned ⚠️</Text>
        <Text style={styles.resultSubtitle}>This ticket was already used</Text>
      </View>

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

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ticket Type:</Text>
          <View style={[styles.ticketTypeBadge, styles.warningBadge]}>
            <Text style={styles.ticketTypeText}>{attendeeInfo.ticketType}</Text>
          </View>
        </View>
      </View>

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

// Error Result Component
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
  },
  loadingText: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray600,
    marginTop: 12,
  },
  permissionTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 20,
    color: Colors.gray900,
    marginTop: 20,
    marginBottom: 8,
  },
  permissionText: {
    fontFamily: 'Sora-Regular',
    fontSize: 15,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.green,
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  scanLine: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.green,
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  overlayBottom: {
    flex: 1.5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  instructionsContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  instructionText: {
    fontFamily: 'Sora-Medium',
    fontSize: 16,
    color: Colors.white,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  torchButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  torchButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
  // Result Overlay Styles
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    width: width - 40,
    maxHeight: height - 200,
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
  resultContent: {
    padding: 24,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successIcon: {
    backgroundColor: Colors.success,
  },
  warningIcon: {
    backgroundColor: Colors.warning,
  },
  errorIcon: {
    backgroundColor: Colors.error,
  },
  resultTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 24,
    color: Colors.gray900,
    marginBottom: 4,
  },
  resultSubtitle: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray600,
  },
  resultCard: {
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  warningCard: {
    backgroundColor: Colors.amber50,
    borderColor: Colors.warning,
  },
  errorCard: {
    backgroundColor: Colors.red50,
    borderColor: Colors.error,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  cardTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.gray900,
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray600,
  },
  infoValue: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.gray900,
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  infoValueSmall: {
    fontFamily: 'Sora-Medium',
    fontSize: 12,
    color: Colors.gray900,
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  ticketTypeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  warningBadge: {
    backgroundColor: Colors.warning,
  },
  ticketTypeText: {
    fontFamily: 'Sora-Bold',
    fontSize: 12,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  errorMessage: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 12,
  },
  errorHint: {
    fontFamily: 'Sora-Regular',
    fontSize: 13,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  warningButton: {
    backgroundColor: Colors.warning,
  },
  errorButton: {
    backgroundColor: Colors.error,
  },
  resetButtonText: {
    fontFamily: 'Sora-Bold',
    fontSize: 16,
    color: Colors.white,
  },
});

export default QrScanner;