import { scanTicket } from '@/api/services/ticketServices';
import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import SuccessResult from '@/components/scan-results/SuccessResult';
import AlreadyScannedResult from '@/components/scan-results/AlreadyScannedResult';
import ErrorResult from '@/components/scan-results/ErrorResult';
import OfflineQueuedResult from '@/components/scan-results/OfflineQueuedResult';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as Network from 'expo-network';
import { router, useLocalSearchParams } from 'expo-router';
import { BarChart3, Camera as CameraIcon, Ticket, Users, WifiOff } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

// Cache configuration
const CACHE_CONFIG = {
  MAX_TICKETS: 5000,           // Maximum cached tickets per event
  EXPIRY_HOURS: 48,            // Auto-expire cache after 48 hours
  CLEANUP_ON_START: true,      // Clean expired caches on component mount
};

const QrScanner = () => {
  const { id, eventTitle, isHost } = useLocalSearchParams();
  const eventId = id; // Use id from route params
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [torch, setTorch] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  // TODO: Bulk Scan Mode - Feature for v2
  // const [bulkScanMode, setBulkScanMode] = useState(false);
  // const [bulkScanCount, setBulkScanCount] = useState(0);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  
  // Animation values
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;

  // Track last event ID to detect event changes
  useEffect(() => {
    const checkEventChange = async () => {
      try {
        const lastEventId = await AsyncStorage.getItem('last_scanned_event_id');
        
        if (lastEventId && lastEventId !== eventId) {
          console.log(`🔄 Event changed from ${lastEventId} to ${eventId}`);
          // Optional: Clean up old event cache
          // await AsyncStorage.removeItem(`scanned_tickets_${lastEventId}`);
        }
        
        await AsyncStorage.setItem('last_scanned_event_id', eventId);
      } catch (error) {
        console.error('Error checking event change:', error);
      }
    };

    checkEventChange();
  }, [eventId]);

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

    // Check network status
    checkNetworkStatus();
    
    // Load offline queue count
    loadOfflineQueueCount();

    // Clean up expired caches on mount
    if (CACHE_CONFIG.CLEANUP_ON_START) {
      cleanupExpiredCaches();
    }

    // Log cache stats for debugging (optional)
    getCacheStats().then(stats => {
      if (stats) {
        console.log('📊 Cache Stats:', {
          tickets: `${stats.count}/${stats.maxCapacity}`,
          utilization: `${stats.utilization}%`,
          age: `${stats.ageHours}h`,
          expiresIn: `${stats.expiresInHours}h`,
        });
      }
    });

    // Set up network listener
    const networkListener = Network.addNetworkStateListener(handleNetworkChange);
    
    return () => {
      networkListener?.remove();
    };
  }, []);

  const checkNetworkStatus = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsOffline(!networkState.isConnected);
    } catch (error) {
      console.error('Error checking network:', error);
    }
  };

  const handleNetworkChange = (networkState) => {
    const wasOffline = isOffline;
    const nowOffline = !networkState.isConnected;
    
    setIsOffline(nowOffline);
    
    // If we just came back online, sync queued scans
    if (wasOffline && !nowOffline) {
      syncOfflineScans();
    }
  };

  const loadOfflineQueueCount = async () => {
    try {
      const queue = await AsyncStorage.getItem(`offline_scans_${eventId}`);
      if (queue) {
        const scans = JSON.parse(queue);
        setOfflineQueueCount(scans.length);
      }
    } catch (error) {
      console.error('Error loading offline queue count:', error);
    }
  };

  // Cleanup expired caches across all events
  const cleanupExpiredCaches = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith('scanned_tickets_'));
      const now = new Date().getTime();
      const expiryMs = CACHE_CONFIG.EXPIRY_HOURS * 60 * 60 * 1000;

      let cleanedCount = 0;

      for (const key of cacheKeys) {
        const cacheData = await AsyncStorage.getItem(key);
        if (cacheData) {
          const cache = JSON.parse(cacheData);
          
          // Check if cache has expired
          if (cache.createdAt) {
            const cacheAge = now - new Date(cache.createdAt).getTime();
            if (cacheAge > expiryMs) {
              await AsyncStorage.removeItem(key);
              cleanedCount++;
              console.log(`🧹 Cleaned expired cache: ${key}`);
            }
          }
        }
      }

      if (cleanedCount > 0) {
        console.log(`✅ Cleaned ${cleanedCount} expired cache(s)`);
      }
    } catch (error) {
      console.error('Error cleaning up expired caches:', error);
    }
  };

  // Get cache with metadata
  const getTicketCache = async () => {
    try {
      const cacheKey = `scanned_tickets_${eventId}`;
      const cacheData = await AsyncStorage.getItem(cacheKey);
      
      if (!cacheData) {
        return {
          tickets: [],
          ticketSet: new Set(),
          createdAt: new Date().toISOString(),
        };
      }

      const cache = JSON.parse(cacheData);
      
      // Check if expired
      const now = new Date().getTime();
      const cacheAge = now - new Date(cache.createdAt).getTime();
      const expiryMs = CACHE_CONFIG.EXPIRY_HOURS * 60 * 60 * 1000;
      
      if (cacheAge > expiryMs) {
        console.log('⏰ Cache expired, resetting...');
        return {
          tickets: [],
          ticketSet: new Set(),
          createdAt: new Date().toISOString(),
        };
      }

      // Build Set for O(1) lookups
      const ticketSet = new Set(cache.tickets.map(t => t.ticketCode));
      
      return {
        tickets: cache.tickets,
        ticketSet,
        createdAt: cache.createdAt,
      };
    } catch (error) {
      console.error('Error getting ticket cache:', error);
      return {
        tickets: [],
        ticketSet: new Set(),
        createdAt: new Date().toISOString(),
      };
    }
  };

  // Cache scanned tickets locally with size limit and expiry
  const cacheScannedTicket = async (ticketCode, scannedBy = 'Current User') => {
    try {
      const cacheKey = `scanned_tickets_${eventId}`;
      const cache = await getTicketCache();
      
      // Check if already cached (avoid duplicates)
      if (cache.ticketSet.has(ticketCode)) {
        return; // Already cached, skip
      }

      // Add new ticket
      cache.tickets.push({
        ticketCode,
        timestamp: new Date().toISOString(),
        scannedBy,
      });

      // Apply size limit (FIFO - keep most recent)
      if (cache.tickets.length > CACHE_CONFIG.MAX_TICKETS) {
        const excess = cache.tickets.length - CACHE_CONFIG.MAX_TICKETS;
        cache.tickets = cache.tickets.slice(excess);
        console.log(`📊 Cache limit reached, removed ${excess} oldest entries`);
      }

      // Save with metadata
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        tickets: cache.tickets,
        createdAt: cache.createdAt,
        lastUpdated: new Date().toISOString(),
      }));

      console.log(`💾 Cached ticket (${cache.tickets.length}/${CACHE_CONFIG.MAX_TICKETS})`);
    } catch (error) {
      console.error('Error caching scanned ticket:', error);
    }
  };

  // Fast O(1) duplicate check using Set
  const isTicketAlreadyScanned = async (ticketCode) => {
    try {
      // Get cache with Set for fast lookup
      const cache = await getTicketCache();
      
      // O(1) Set lookup
      if (cache.ticketSet.has(ticketCode)) {
        const ticket = cache.tickets.find(t => t.ticketCode === ticketCode);
        return {
          alreadyScanned: true,
          scannedAt: ticket.timestamp,
          scannedBy: ticket.scannedBy,
        };
      }

      // Check in offline queue
      const queueStr = await AsyncStorage.getItem(`offline_scans_${eventId}`);
      const queue = queueStr ? JSON.parse(queueStr) : [];
      const queuedScan = queue.find(scan => scan.ticketCode === ticketCode);
      
      if (queuedScan) {
        return {
          alreadyScanned: true,
          scannedAt: queuedScan.timestamp,
          scannedBy: 'Current User (Queued)',
          isQueued: true,
        };
      }

      return { alreadyScanned: false };
    } catch (error) {
      console.error('Error checking scanned tickets:', error);
      return { alreadyScanned: false };
    }
  };

  // Clear local cache for current event
  const clearScannedTicketsCache = async () => {
    try {
      await AsyncStorage.removeItem(`scanned_tickets_${eventId}`);
      console.log('✅ Scanned tickets cache cleared for current event');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Get cache statistics (useful for debugging/monitoring)
  const getCacheStats = async () => {
    try {
      const cache = await getTicketCache();
      const now = new Date().getTime();
      const cacheAge = now - new Date(cache.createdAt).getTime();
      const ageHours = Math.floor(cacheAge / (60 * 60 * 1000));
      
      return {
        count: cache.tickets.length,
        maxCapacity: CACHE_CONFIG.MAX_TICKETS,
        utilization: ((cache.tickets.length / CACHE_CONFIG.MAX_TICKETS) * 100).toFixed(1),
        ageHours,
        expiresInHours: Math.max(0, CACHE_CONFIG.EXPIRY_HOURS - ageHours),
        createdAt: cache.createdAt,
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return null;
    }
  };

  const queueOfflineScan = async (ticketCode) => {
    try {
      const scanData = {
        ticketCode,
        timestamp: new Date().toISOString(),
        eventId,
      };

      // Get existing queue
      const queueStr = await AsyncStorage.getItem(`offline_scans_${eventId}`);
      const queue = queueStr ? JSON.parse(queueStr) : [];
      
      // Add to queue
      queue.push(scanData);
      
      // Save queue
      await AsyncStorage.setItem(`offline_scans_${eventId}`, JSON.stringify(queue));
      
      setOfflineQueueCount(queue.length);
      
      // Cache the ticket to prevent re-scanning
      await cacheScannedTicket(ticketCode, 'Current User (Offline)');
      
      return true;
    } catch (error) {
      console.error('Error queueing offline scan:', error);
      return false;
    }
  };

  const syncOfflineScans = async () => {
    try {
      const queueStr = await AsyncStorage.getItem(`offline_scans_${eventId}`);
      if (!queueStr) return;

      const queue = JSON.parse(queueStr);
      if (queue.length === 0) return;

      console.log(`📤 Syncing ${queue.length} offline scans...`);

      let successCount = 0;
      let failedScans = [];

      for (const scan of queue) {
        try {
          await scanTicket(scan.ticketCode, {
            scanMethod: 'in-app-offline-sync',
            scanLocation: 'Mobile App Scanner (Offline Sync)',
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to sync scan ${scan.ticketCode}:`, error);
          failedScans.push(scan);
        }
      }

      // Update queue with failed scans only
      await AsyncStorage.setItem(`offline_scans_${eventId}`, JSON.stringify(failedScans));
      setOfflineQueueCount(failedScans.length);

      if (successCount > 0) {
        Alert.alert(
          'Sync Complete',
          `Successfully synced ${successCount} offline scan${successCount !== 1 ? 's' : ''}!` +
          (failedScans.length > 0 ? `\n\n${failedScans.length} scan${failedScans.length !== 1 ? 's' : ''} failed and will retry later.` : '')
        );
      }
    } catch (error) {
      console.error('Error syncing offline scans:', error);
    }
  };

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

      // Check if offline
      if (isOffline) {
        // Check if already scanned (local cache or queue)
        const scanCheck = await isTicketAlreadyScanned(ticketCode);
        
        if (scanCheck.alreadyScanned) {
          // Show already scanned result
          showAlreadyScannedResult({
            attendeeInfo: {
              name: 'Unknown',
              email: 'Scanned while offline',
              ticketType: 'Unknown',
            },
            scannedAt: scanCheck.scannedAt,
            scannedBy: scanCheck.scannedBy,
            isOffline: true,
          });
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          return;
        }

        // Queue the scan for later
        const queued = await queueOfflineScan(ticketCode);
        if (queued) {
          showOfflineQueuedResult(ticketCode);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          // TODO: Bulk Scan Mode - Auto-reset for v2
          // if (bulkScanMode) {
          //   setBulkScanCount(prev => prev + 1);
          //   setTimeout(() => {
          //     resetScanner();
          //   }, 2000);
          // }
        } else {
          throw new Error('Failed to queue offline scan');
        }
        return;
      }

      // Call API to scan ticket
      const response = await scanTicket(ticketCode, {
        scanMethod: 'in-app',
        scanLocation: 'Mobile App Scanner',
      });

      console.log('✅ Scan successful:', response);

      // Cache the scanned ticket
      await cacheScannedTicket(ticketCode, response.scanInfo?.scannedBy || 'Current User');

      // Show success result
      showSuccessResult(response);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // TODO: Bulk Scan Mode - Auto-reset for v2
      // if (bulkScanMode) {
      //   setBulkScanCount(prev => prev + 1);
      //   setTimeout(() => {
      //     resetScanner();
      //   }, 2000);
      // }

    } catch (error) {
      console.error('❌ Scan error:', error);

      if (error.response?.data?.alreadyUsed) {
        // Ticket already scanned - cache it
        const errorData = error.response.data;
        await cacheScannedTicket(
          ticketCode, 
          errorData.scannedBy || 'Unknown User'
        );
        
        showAlreadyScannedResult(errorData);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        
        // TODO: Bulk Scan Mode - Auto-reset for v2
        // if (bulkScanMode) {
        //   setTimeout(() => {
        //     resetScanner();
        //   }, 1500);
        // }
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

  const showOfflineQueuedResult = (ticketCode) => {
    setScanResult({
      type: 'offline-queued',
      ticketCode: ticketCode,
    });
    animateResult();
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

      {/* Control Bar - Quick Access to Staff & Stats */}
      <View style={styles.controlBar}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => router.push({
            pathname: '/(screens)/staff-management/[id]',
            params: { id: eventId, eventTitle, isHost }
          })}
        >
          <View style={styles.iconContainer}>
            <Users size={20} color={Colors.primary} />
          </View>
          <Text style={styles.controlButtonText}>Staff</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => router.push({
            pathname: '/(screens)/scan-statistics/[id]',
            params: { id: eventId, eventTitle }
          })}
        >
          <View style={styles.iconContainer}>
            <BarChart3 size={20} color={Colors.primary} />
          </View>
          <Text style={styles.controlButtonText}>Statistics</Text>
        </TouchableOpacity>

        {/* TODO: Bulk Scan Mode - Feature for v2
        <TouchableOpacity
          style={[styles.controlButton, bulkScanMode && styles.controlButtonActive]}
          onPress={() => {
            setBulkScanMode(!bulkScanMode);
            if (!bulkScanMode) {
              setBulkScanCount(0);
            }
          }}
        >
          <Zap size={20} color={bulkScanMode ? Colors.white : Colors.primary} />
          <Text style={[styles.controlButtonText, bulkScanMode && styles.controlButtonTextActive]}>
            {bulkScanMode ? `Bulk (${bulkScanCount})` : 'Bulk'}
          </Text>
        </TouchableOpacity>
        */}

        {isOffline && (
          <View style={styles.offlineIndicator}>
            <WifiOff size={16} color={Colors.white} />
            <Text style={styles.offlineText}>Offline</Text>
            {offlineQueueCount > 0 && (
              <View style={styles.offlineQueueBadge}>
                <Text style={styles.offlineQueueText}>{offlineQueueCount}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          enableTorch={torch}
        />

        {/* Overlay with scan area - positioned absolutely on top of camera */}
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
              {scanResult.type === 'offline-queued' && (
                <OfflineQueuedResult ticketCode={scanResult.ticketCode} onReset={resetScanner} />
              )}
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
  },
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    gap: 16,
  },
  controlButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    minWidth: 100,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  controlButtonText: {
    fontFamily: 'Sora-Medium',
    fontSize: 12,
    color: Colors.gray700,
  },
  // Commented out for v2 - Bulk Scan Feature
  /*
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.gray50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  controlButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  controlButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 13,
    color: Colors.primary,
  },
  controlButtonTextActive: {
    color: Colors.white,
  },
  */
  offlineIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.error,
    borderRadius: 20,
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  offlineText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 13,
    color: Colors.white,
  },
  offlineQueueBadge: {
    backgroundColor: Colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  offlineQueueText: {
    fontFamily: 'Sora-Bold',
    fontSize: 11,
    color: Colors.error,
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
    ...StyleSheet.absoluteFillObject,
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
    maxHeight: height - 180,
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default QrScanner;