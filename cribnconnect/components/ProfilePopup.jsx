import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { 
  User, 
  Settings, 
  Bell, 
  Home, 
  UserPlus, 
  LogIn,
  LogOut,
  Mail,
  X
} from 'lucide-react-native';
// Uncomment when you implement the AuthContext
// import { useAuth } from '@/contexts/AuthContext';
// import { logoutUser } from '@/services/authService';

const { width } = Dimensions.get('window');

export default function ProfilePopup({ visible, onClose, user = null }) {
  // Uncomment these lines when you implement the AuthContext:
  // const { user: authUser, isAuthenticated } = useAuth();
  // const currentUser = authUser || user;
  
  // For now, using mock data - TODO: Replace with actual user data from Firebase
  const isAuthenticated = false; // Change this based on your auth state
  const currentUser = user || {
    name: "Guest User",
    email: null, // null if not logged in
    isLoggedIn: isAuthenticated,
  };

  const handleNavigation = (route) => {
    onClose(); // Close popup first
    setTimeout(() => {
      router.push(route);
    }, 100); // Small delay to ensure smooth animation
  };

  const handleLogout = async () => {
    try {
      // Uncomment when implementing Firebase auth:
      // const result = await logoutUser();
      // if (result.success) {
      //   onClose();
      //   router.push('/(auth)/login');
      // }
      
      // For now, just log and close
      console.log('Logout clicked');
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      id: 'host',
      title: 'Host',
      subtitle: 'List your apartment or create events',
      icon: Home,
      route: '/(hosting)/add-apartment',
      showAlways: true,
    },
    {
      id: 'profile',
      title: 'Create Profile',
      subtitle: 'Set up your profile information',
      icon: UserPlus,
      route: '/(screens)/create-profile',
      showAlways: true,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      icon: Bell,
      route: '/(screens)/notifications',
      showWhenLoggedIn: true,
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Account and app preferences',
      icon: Settings,
      route: '/(screens)/settings',
      showAlways: true,
    },
    {
      id: 'login',
      title: 'Login',
      subtitle: 'Sign in to your account',
      icon: LogIn,
      route: '/(auth)/login',
      showWhenLoggedOut: true,
    },
    {
      id: 'logout',
      title: 'Logout',
      subtitle: 'Sign out of your account',
      icon: LogOut,
      action: handleLogout,
      showWhenLoggedIn: true,
    },
  ];

  // Filter menu items based on login status
  const visibleMenuItems = menuItems.filter(item => {
    if (item.showAlways) return true;
    if (item.showWhenLoggedIn && isAuthenticated) return true;
    if (item.showWhenLoggedOut && !isAuthenticated) return true;
    return false;
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.popupContainer}>
          {/* Header with close button */}
          <View style={styles.popupHeader}>
            <Text style={styles.popupTitle}>Profile Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={Colors.gray500} />
            </TouchableOpacity>
          </View>

          {/* User Info Section */}
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {currentUser?.displayName || currentUser?.name || "Guest User"}
              </Text>
              {currentUser?.email ? (
                <View style={styles.emailContainer}>
                  <Mail size={14} color={Colors.gray500} />
                  <Text style={styles.userEmail}>{currentUser.email}</Text>
                </View>
              ) : (
                <Text style={styles.userStatus}>Not logged in</Text>
              )}
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {visibleMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => item.action ? item.action() : handleNavigation(item.route)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconContainer}>
                    <IconComponent size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                  <View style={styles.menuArrow}>
                    <Text style={styles.arrowText}>›</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 64, // Account for header height
    paddingRight: 16,
  },
  popupContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: width * 0.85,
    maxWidth: 320,
    elevation: 8,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBackground,
  },
  popupTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: Colors.gray900,
  },
  closeButton: {
    padding: 4,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontFamily: 'Sora-Bold',
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.gray900,
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmail: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray500,
    marginLeft: 6,
  },
  userStatus: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray500,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightBackground,
    marginHorizontal: 20,
  },
  menuSection: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    activeOpacity: 0.7,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.gray900,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontFamily: 'Sora-Regular',
    fontSize: 13,
    color: Colors.gray500,
    lineHeight: 18,
  },
  menuArrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 20,
    color: Colors.gray400,
    fontWeight: 'bold',
  },
});
