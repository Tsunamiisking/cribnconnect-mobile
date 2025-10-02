// In your app initialization
const { initialize } = useHostingStore();
useEffect(() => {
  initialize(); // Auto-cleanup on app start
}, []);

// Manual cleanup
const { cleanupDrafts, getDraftStorageInfo } = useHostingStore();
const storageInfo = getDraftStorageInfo();
const cleanupResult = cleanupDrafts();