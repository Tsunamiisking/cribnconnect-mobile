import { verifyPayment } from "@/api/services/ticketServices";
import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const PaystackCheckout = () => {
  const { url, reference, eventId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const hasVerifiedRef = useRef(false);
  const errorCountRef = useRef(0);
  const webViewRef = useRef(null);

  const handleShouldStartLoadWithRequest = (request) => {
    const currentUrl = request.url;
    console.log("📍 Request URL:", currentUrl);

    // Check if payment was successful (Paystack redirects with reference in URL)
    if (
      currentUrl.includes("reference=") ||
      currentUrl.includes("trxref=") ||
      currentUrl.includes("payment-callback") ||
      currentUrl.includes("success")
    ) {
      if (hasVerifiedRef.current || verifying) {
        console.log("⚠️ Already verifying, blocking duplicate navigation");
        return false; // Block navigation
      }

      hasVerifiedRef.current = true;
      setVerifying(true);
      setLoading(false); // Hide loading overlay

      console.log("✅ Payment completed, verifying with backend...");

      // Run verification asynchronously
      (async () => {
        try {
          const verificationResult = await verifyPayment(reference);
          console.log("✅ Verification successful:", verificationResult);

          setVerifying(false);

          Alert.alert(
            "Success 🎉",
            "Your ticket purchase was successful! Welcome to the event chat.",
            [
              {
                text: "Go to Chat",
                onPress: () => {
                  // Navigate to event chat screen
                  router.replace(`/(screens)/chat/${eventId}?type=event`);
                },
              },
            ],
            { cancelable: false }
          );
        } catch (error) {
          console.error("❌ Verification error:", error);
          setVerifying(false);

          Alert.alert(
            "Verification Failed",
            "Payment completed but verification failed. Your ticket will be processed. Please check your tickets.",
            [
              {
                text: "OK",
                onPress: () => {
                  router.back();
                  router.back();
                },
              },
            ],
            { cancelable: false }
          );
        }
      })();

      // 🔒 Block navigation to callback URL - prevents DNS error
      return false;
    }

    // Check if payment was cancelled
    if (currentUrl.includes("cancel") || currentUrl.includes("close")) {
      console.log("❌ Payment cancelled by user");

      Alert.alert(
        "Payment Cancelled",
        "You cancelled the payment. Your reservation will expire in 10 minutes.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );

      return false;
    }

    // Allow all other URLs (Paystack checkout, OTP, bank verification, etc.)
    return true;
  };

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error("❌ WebView error:", nativeEvent);

    errorCountRef.current += 1;

    // Only show error alert after 2nd failed attempt
    // First error often resolves automatically with WebView retry
    if (errorCountRef.current < 2) {
      console.log("🔄 First load error, WebView will retry automatically...");
      // Automatically retry after a short delay
      setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.reload();
        }
      }, 1000);
      return;
    }

    Alert.alert(
      "Payment Error",
      "Unable to load payment page. Please check your internet connection and try again.",
      [
        {
          text: "Retry",
          onPress: () => {
            errorCountRef.current = 0;
            if (webViewRef.current) {
              webViewRef.current.reload();
            }
          },
        },
        {
          text: "Cancel",
          onPress: () => router.back(),
          style: "cancel",
        },
      ]
    );
  };

  if (!url || !reference) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Payment" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid payment session</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <BackHeader title="Complete Payment" />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading payment page...</Text>
        </View>
      )}

      {verifying && (
        <View style={styles.verifyingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.verifyingText}>Verifying payment...</Text>
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        onLoadStart={() => {
          setLoading(true);
          console.log("🔄 WebView started loading...");
        }}
        onLoadEnd={() => {
          setLoading(false);
          console.log("✅ WebView finished loading");
        }}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onError={handleError}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    fontFamily: "Sora-Regular",
    fontSize: 16,
    color: Colors.gray500,
    marginTop: 12,
  },
  verifyingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  verifyingText: {
    fontFamily: "Sora-SemiBold",
    fontSize: 16,
    color: Colors.gray900,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontFamily: "Sora-Regular",
    fontSize: 16,
    color: Colors.gray500,
  },
});

export default PaystackCheckout;
