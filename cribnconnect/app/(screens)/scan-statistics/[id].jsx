import { getScanStats } from '@/api/services/ticketServices';
import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { BarChart3, CheckCircle, Clock, Ticket, TrendingUp, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ScanStatisticsScreen = () => {
  const { eventId, eventTitle } = useLocalSearchParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await getScanStats(eventId);
      setStats(response.statistics);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Scan Statistics" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading statistics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!stats) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Scan Statistics" />
        <View style={styles.errorContainer}>
          <BarChart3 size={64} color={Colors.gray400} />
          <Text style={styles.errorText}>No statistics available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const scanPercentage = parseFloat(stats.scanPercentage || 0);

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title={`Statistics - ${eventTitle || 'Event'}`} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Overall Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.primaryCard]}>
            <View style={styles.statIcon}>
              <Ticket size={24} color={Colors.white} />
            </View>
            <Text style={styles.statValue}>{stats.totalTickets}</Text>
            <Text style={styles.statLabel}>Total Tickets</Text>
          </View>

          <View style={[styles.statCard, styles.successCard]}>
            <View style={styles.statIcon}>
              <CheckCircle size={24} color={Colors.white} />
            </View>
            <Text style={styles.statValue}>{stats.scannedTickets}</Text>
            <Text style={styles.statLabel}>Scanned</Text>
          </View>

          <View style={[styles.statCard, styles.warningCard]}>
            <View style={styles.statIcon}>
              <Clock size={24} color={Colors.white} />
            </View>
            <Text style={styles.statValue}>{stats.remainingTickets}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>

          <View style={[styles.statCard, styles.infoCard]}>
            <View style={styles.statIcon}>
              <TrendingUp size={24} color={Colors.white} />
            </View>
            <Text style={styles.statValue}>{scanPercentage.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
        </View>

        {/* Overall Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BarChart3 size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Overall Progress</Text>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Scan Progress</Text>
              <Text style={styles.progressPercentage}>{scanPercentage.toFixed(1)}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${scanPercentage}%`,
                    backgroundColor:
                      scanPercentage < 30
                        ? Colors.error
                        : scanPercentage < 70
                        ? Colors.warning
                        : Colors.success,
                  },
                ]}
              />
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressStat}>
                {stats.scannedTickets} of {stats.totalTickets} tickets scanned
              </Text>
            </View>
          </View>
        </View>

        {/* Breakdown by Ticket Type */}
        {stats.byTicketType && Object.keys(stats.byTicketType).length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>By Ticket Type</Text>
            </View>

            {Object.entries(stats.byTicketType).map(([ticketType, data]) => {
              const typePercentage = data.total > 0 ? (data.scanned / data.total) * 100 : 0;
              
              return (
                <View key={ticketType} style={styles.ticketTypeCard}>
                  <View style={styles.ticketTypeHeader}>
                    <View style={styles.ticketTypeBadge}>
                      <Text style={styles.ticketTypeName}>{ticketType}</Text>
                    </View>
                    <Text style={styles.ticketTypePercentage}>
                      {typePercentage.toFixed(1)}%
                    </Text>
                  </View>

                  <View style={styles.ticketTypeStats}>
                    <View style={styles.ticketTypeStat}>
                      <Text style={styles.ticketTypeStatLabel}>Total</Text>
                      <Text style={styles.ticketTypeStatValue}>{data.total}</Text>
                    </View>
                    <View style={styles.ticketTypeStat}>
                      <Text style={styles.ticketTypeStatLabel}>Scanned</Text>
                      <Text style={styles.ticketTypeStatValue}>{data.scanned}</Text>
                    </View>
                    <View style={styles.ticketTypeStat}>
                      <Text style={styles.ticketTypeStatLabel}>Remaining</Text>
                      <Text style={styles.ticketTypeStatValue}>
                        {data.total - data.scanned}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.ticketTypeProgressBar}>
                    <View
                      style={[
                        styles.ticketTypeProgressFill,
                        {
                          width: `${typePercentage}%`,
                          backgroundColor:
                            typePercentage < 30
                              ? Colors.error
                              : typePercentage < 70
                              ? Colors.warning
                              : Colors.success,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Insights</Text>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightText}>
              {scanPercentage < 30
                ? '📊 Entry has just begun. Make sure all scanners are ready.'
                : scanPercentage < 50
                ? '🚀 Entry is progressing well. Keep it up!'
                : scanPercentage < 80
                ? '🎯 Great progress! Most attendees have arrived.'
                : scanPercentage < 100
                ? '✨ Almost complete! Just a few more attendees to go.'
                : '🎉 All tickets scanned! Event is at full capacity.'}
            </Text>
          </View>

          {stats.remainingTickets > 0 && (
            <View style={[styles.insightCard, styles.warningInsightCard]}>
              <Text style={styles.insightText}>
                ⏰ {stats.remainingTickets} ticket{stats.remainingTickets !== 1 ? 's' : ''} not yet scanned.
                {stats.remainingTickets > stats.totalTickets * 0.3 &&
                  ' Consider additional entry points if there are long queues.'}
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray600,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.gray600,
    marginTop: 16,
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  statCard: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: Colors.primary,
  },
  successCard: {
    backgroundColor: Colors.success,
  },
  warningCard: {
    backgroundColor: Colors.warning,
  },
  infoCard: {
    backgroundColor: Colors.blue500,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Sora-Bold',
    fontSize: 32,
    color: Colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Sora-Medium',
    fontSize: 13,
    color: Colors.white,
    opacity: 0.9,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 18,
    color: Colors.gray900,
    marginLeft: 8,
  },
  progressCard: {
    backgroundColor: Colors.gray50,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 15,
    color: Colors.gray900,
  },
  progressPercentage: {
    fontFamily: 'Sora-Bold',
    fontSize: 20,
    color: Colors.primary,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: Colors.gray200,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressStats: {
    alignItems: 'center',
  },
  progressStat: {
    fontFamily: 'Sora-Regular',
    fontSize: 13,
    color: Colors.gray600,
  },
  ticketTypeCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  ticketTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketTypeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ticketTypeName: {
    fontFamily: 'Sora-Bold',
    fontSize: 14,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  ticketTypePercentage: {
    fontFamily: 'Sora-Bold',
    fontSize: 20,
    color: Colors.primary,
  },
  ticketTypeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  ticketTypeStat: {
    alignItems: 'center',
  },
  ticketTypeStatLabel: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.gray600,
    marginBottom: 4,
  },
  ticketTypeStatValue: {
    fontFamily: 'Sora-Bold',
    fontSize: 18,
    color: Colors.gray900,
  },
  ticketTypeProgressBar: {
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  ticketTypeProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  insightCard: {
    backgroundColor: Colors.blue50,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.blue500,
  },
  warningInsightCard: {
    backgroundColor: Colors.amber50,
    borderColor: Colors.warning,
  },
  insightText: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray800,
    lineHeight: 20,
  },
});

export default ScanStatisticsScreen;