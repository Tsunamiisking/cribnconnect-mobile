import { getPendingChatRequests } from "@/api/services/chatServices";
import BackHeader from "@/components/BackHeader";
import ChatRequestCard from "@/components/ChatRequestCard";
import { Colors } from "@/constants/Colors";
import { Inbox } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatRequestsScreen = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getPendingChatRequests();
      // Backend returns { conversations: [], count: n }
      // Filter to only show requests where we are the recipient
      const pendingRequests = (data.conversations || []).filter(
        conv => conv.status === 'pending' && conv.isRecipient
      );
      setRequests(pendingRequests);
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  }, []);

  const handleAccept = (conversationId) => {
    setRequests(prev => prev.filter(req => req.conversationId !== conversationId));
  };

  const handleIgnore = (conversationId) => {
    setRequests(prev => prev.filter(req => req.conversationId !== conversationId));
  };

  const renderRequest = ({ item }) => (
    <ChatRequestCard
      request={item}
      onAccept={handleAccept}
      onIgnore={handleIgnore}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Inbox size={56} color={Colors.gray400} />
      </View>
      <Text style={styles.emptyTitle}>No Pending Requests</Text>
      <Text style={styles.emptyText}>
        When someone sends you a chat request, it will appear here
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Chat Requests" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Chat Requests" />
      
      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.conversationId}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray900,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default ChatRequestsScreen;
