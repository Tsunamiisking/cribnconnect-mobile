import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from "firebase/auth";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const MONGO_URL = "https://cribnconnect-api.onrender.com";

// User registration
export const registerUser = async (userData: any) => {
  const toast = useToast();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userCredential.user;

    // Update the user's display name
    if (userData.name) {
      await updateProfile(user, {
        displayName: userData.name,
      });
    }

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await axios
      .post(MONGO_URL, {
        uid: user.uid,
        email: user.email,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
      })
      .then((res) => {
        console.log("MongoDB response:", res.data);
        toast.show("User saved to MongoDB", { type: "success" });
      })
      .catch((err) => {
        toast.show("Error saving user to MongoDB", { type: "danger" });
        console.error("MongoDB error:", err);
      });

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// User login
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
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
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { userData: userDoc.data(), error: null };
    } else {
      return { userData: null, error: "User document not found" };
    }
  } catch (error: any) {
    return { userData: null, error: error.message };
  }
};

// Update user data in Firestore
export const updateUserData = async (uid: string, userData: any) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...userData,
      updatedAt: new Date().toISOString(),
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
