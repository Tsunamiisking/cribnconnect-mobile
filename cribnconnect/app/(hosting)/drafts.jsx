import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import useHostingStore from '@/stores/hostingStore';
import { router } from 'expo-router';
import { Building2, Cloud, CloudOff, Edit3, Loader2, Tickets, Trash2, Wifi } from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DraftsScreen() {
  const { 
    drafts, 
    deleteDraft, 
    loadDraft, 
    syncDraftToServer, 
    cleanupDrafts, 
    getDraftStorageInfo 
  } = useHostingStore();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSyncStatusIcon = (draft) => {
    switch (draft.status) {
      case 'synced':
        return <Cloud size={16} color={Colors.success} />;
      case 'uploading':
        return <Loader2 size={16} color={Colors.primary} style={{ opacity: 0.7 }} />;
      case 'local':
      default:
        return <CloudOff size={16} color={Colors.gray600} />;
    }
  };

  const getSyncStatusText = (draft) => {
    switch (draft.status) {
      case 'synced':
        return 'Synced';
      case 'uploading':
        return 'Syncing...';
      case 'local':
      default:
        return 'Local only';
    }
  };

  const handleSyncDraft = async (draft) => {
    const result = await syncDraftToServer(draft.id);
    if (!result.success) {
      Alert.alert('Sync Failed', result.error || 'Unable to sync draft to server');
    }
  };

  const handleCleanupDrafts = () => {
    const storageInfo = getDraftStorageInfo();
    
    Alert.alert(
      'Clean Up Drafts',
      `Storage: ${storageInfo.sizeInMB}MB used by ${storageInfo.totalDrafts} drafts.\n\nThis will remove old local drafts (30+ days) and limit total drafts to 50.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clean Up',
          onPress: () => {
            const result = cleanupDrafts();
            if (result.removedCount > 0) {
              Alert.alert('Success', `Removed ${result.removedCount} old drafts.`);
            } else {
              Alert.alert('Info', 'No old drafts found to clean up.');
            }
          },
        },
      ]
    );
  };

  const getTitle = (draft) => {
    if (draft.type === 'apartment') {
      return draft.data.details?.title || draft.data.apartmentType || 'Untitled Apartment';
    } else if (draft.type === 'event') {
      return draft.data.title || draft.data.eventType || 'Untitled Event';
    }
    return 'Untitled Draft';
  };

  const getSubtitle = (draft) => {
    if (draft.type === 'apartment') {
      const location = draft.data.location;
      return location?.city && location?.state 
        ? `${location.city}, ${location.state}` 
        : 'Location not set';
    } else if (draft.type === 'event') {
      const location = draft.data.location;
      return location?.city && location?.state 
        ? `${location.city}, ${location.state}` 
        : 'Location not set';
    }
    return 'Draft in progress';
  };

  const handleEditDraft = async (draft) => {
    const result = loadDraft(draft.id);
    
    if (result.needsMediaReselection) {
      Alert.alert(
        'Media Files Missing',
        'Some media files are no longer available and need to be selected again. You can continue editing and re-select your media files.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: () => {
              if (draft.type === 'apartment') {
                router.push('/(hosting)/add-apartment');
              } else if (draft.type === 'event') {
                router.push('/(hosting)/add-event');
              }
            },
          },
        ]
      );
    } else {
      if (draft.type === 'apartment') {
        router.push('/(hosting)/add-apartment');
      } else if (draft.type === 'event') {
        router.push('/(hosting)/add-event');
      }
    }
  };

  const handleDeleteDraft = (draft) => {
    Alert.alert(
      'Delete Draft',
      'Are you sure you want to delete this draft? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteDraft(draft.id),
        },
      ]
    );
  };

  const renderDraftItem = ({ item: draft }) => (
    <View style={styles.draftCard}>
      <View style={styles.draftHeader}>
        <View style={styles.draftInfo}>
          <View style={styles.titleRow}>
            {draft.type === 'apartment' ? (
              <Building2 size={20} color={Colors.primary} />
            ) : (
              <Tickets size={20} color={Colors.primary} />
            )}
            <Text style={styles.draftTitle}>{getTitle(draft)}</Text>
            <View style={styles.syncStatus}>
              {getSyncStatusIcon(draft)}
            </View>
          </View>
          <Text style={styles.draftSubtitle}>{getSubtitle(draft)}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.draftMeta}>
              Step {draft.currentStep} • Updated {formatDate(draft.updatedAt)}
            </Text>
            <Text style={[styles.syncStatusText, 
              draft.status === 'synced' && styles.syncedText,
              draft.status === 'uploading' && styles.uploadingText
            ]}>
              {getSyncStatusText(draft)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.draftActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditDraft(draft)}
        >
          <Edit3 size={16} color={Colors.white} />
          <Text style={styles.editButtonText}>Continue</Text>
        </TouchableOpacity>
        
        {draft.status === 'local' && (
          <TouchableOpacity
            style={styles.syncButton}
            onPress={() => handleSyncDraft(draft)}
          >
            <Wifi size={16} color={Colors.primary} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteDraft(draft)}
        >
          <Trash2 size={16} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (drafts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Drafts" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Drafts Yet</Text>
          <Text style={styles.emptyMessage}>
            Start creating a listing and save it as a draft to continue later.
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.back()}
          >
            <Text style={styles.startButtonText}>Start Hosting</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Drafts" />
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>
            {drafts.length} Draft{drafts.length !== 1 ? 's' : ''}
          </Text>
          
          {drafts.length > 5 && (
            <TouchableOpacity
              style={styles.cleanupButton}
              onPress={handleCleanupDrafts}
            >
              <Text style={styles.cleanupButtonText}>Clean Up</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <FlatList
          data={drafts}
          renderItem={renderDraftItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
  },
  cleanupButton: {
    backgroundColor: Colors.gray600,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cleanupButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Sora-Medium',
  },
  listContainer: {
    gap: 16,
  },
  draftCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  draftHeader: {
    marginBottom: 12,
  },
  draftInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  draftTitle: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
    flex: 1,
  },
  syncStatus: {
    marginLeft: 'auto',
  },
  draftSubtitle: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.darkgray,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  draftMeta: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    flex: 1,
  },
  syncStatusText: {
    fontSize: 10,
    fontFamily: 'Sora-Medium',
    color: Colors.gray600,
    textTransform: 'uppercase',
  },
  syncedText: {
    color: Colors.success,
  },
  uploadingText: {
    color: Colors.primary,
  },
  draftActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Sora-Medium',
  },
  syncButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary + '10',
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.error + '10',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.darkgray,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
  },
});