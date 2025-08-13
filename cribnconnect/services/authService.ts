import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// User registration
export const registerUser = async (email: string, password: string, userData: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the user's display name
    if (userData.name) {
      await updateProfile(user, {
        displayName: userData.name
      });
    }

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: userData.name || '',
      age: userData.age || null,
      bio: userData.bio || '',
      interests: userData.interests || [],
      profileImage: userData.profileImage || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// User login
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// User logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get user data from Firestore
export const getUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { userData: userDoc.data(), error: null };
    } else {
      return { userData: null, error: 'User document not found' };
    }
  } catch (error: any) {
    return { userData: null, error: error.message };
  }
};

// Update user data in Firestore
export const updateUserData = async (uid: string, userData: any) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...userData,
      updatedAt: new Date().toISOString(),
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
