import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const scanResultStyles = StyleSheet.create({
  resultContent: {
    padding: 16,
  },
  resultScrollContent: {
    paddingBottom: 24,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  infoIcon: {
    backgroundColor: Colors.blue500,
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
  infoCard: {
    backgroundColor: Colors.blue50,
    borderColor: Colors.blue500,
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
  infoButton: {
    backgroundColor: Colors.blue500,
  },
  resetButtonText: {
    fontFamily: 'Sora-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  offlineQueueMessage: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray800,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  ticketCodeContainer: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  ticketCodeLabel: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.gray600,
    marginBottom: 4,
  },
  ticketCodeValue: {
    fontFamily: 'Sora-Bold',
    fontSize: 14,
    color: Colors.gray900,
  },
  offlineWarningContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.warning,
  },
  offlineWarningText: {
    fontFamily: 'Sora-Medium',
    fontSize: 12,
    color: Colors.warning,
    textAlign: 'center',
  },
});
