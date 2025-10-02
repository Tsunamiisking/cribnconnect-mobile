import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import useHostingStore from '@/stores/hostingStore';
import { router } from 'expo-router';
import { Building2, Edit3, Tickets, Trash2 } from 'lucide-react-native';
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
  const { drafts, deleteDraft, loadDraft } = useHostingStore();

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

  const handleEditDraft = (draft) => {
    loadDraft(draft.id);
    
    if (draft.type === 'apartment') {
      router.push('/(hosting)/add-apartment');
    } else if (draft.type === 'event') {
      router.push('/(hosting)/add-event');
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
          </View>
          <Text style={styles.draftSubtitle}>{getSubtitle(draft)}</Text>
          <Text style={styles.draftMeta}>
            Step {draft.currentStep} • Updated {formatDate(draft.updatedAt)}
          </Text>
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
        <Text style={styles.headerText}>
          {drafts.length} Draft{drafts.length !== 1 ? 's' : ''}
        </Text>
        
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
  headerText: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
    marginBottom: 20,
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
  draftSubtitle: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.darkgray,
    marginBottom: 4,
  },
  draftMeta: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
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