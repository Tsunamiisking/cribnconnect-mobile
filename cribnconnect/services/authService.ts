import axios from "axios";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const MONGO_URL = "https://cribnconnect-api.onrender.com";
// const MONGO_URL = "http://localhost:5000";

// User registration
export const registerUser = async (userData: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userCredential.user;

    // Update the user's display name
    const fullName = `${userData.firstName} ${userData.lastName}`.trim();
    if (fullName) {
      await updateProfile(user, {
        displayName: fullName,
      });
    }

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      displayName: fullName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log("User document created in Firestore");

    // Send user data to MongoDB via external API
    try {
      const mongoPayload = {
        uid: user.uid,
        email: user.email,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        displayName: fullName,
      };

      const mongoResponse = await axios.post(`${MONGO_URL}/api/auth/register`, mongoPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log("✅ MongoDB sync successful:", mongoResponse.data);
    } catch (mongoError: any) {
      console.error("❌ MongoDB sync failed:");
      console.error("Error status:", mongoError.response?.status);
      console.error("Error message:", mongoError.message);
      console.error("Error data:", mongoError.response?.data);
      
      if (mongoError.response?.status === 404) {
        console.warn("MongoDB endpoint not found - check if your API is deployed and the URL is correct");
      } else if (mongoError.code === 'ECONNREFUSED') {
        console.warn("MongoDB API server is not running");
      } else if (mongoError.code === 'ENOTFOUND') {
        console.warn("MongoDB API URL is not reachable");
      }
      
      // Don't fail registration if MongoDB fails
      // The user account is already created in Firebase
      console.warn("⚠️ Registration completed in Firebase, but MongoDB sync failed. This is non-critical.");
    }

    return { 
      user, 
      error: null,
      success: true,
      message: "Account created successfully!"
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Provide user-friendly error messages
    let errorMessage = "Registration failed. Please try again.";
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "An account with this email already exists.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "Password is too weak. Please choose a stronger password.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Please enter a valid email address.";
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = "Network error. Please check your connection and try again.";
    }
    
    return { 
      user: null, 
      error: errorMessage,
      success: false
    };
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
    
    return { 
      user: userCredential.user, 
      error: null,
      success: true,
      message: "Login successful!"
    };
  } catch (error: any) {
    console.error("Login error:", error);
    
    // Provide user-friendly error messages
    let errorMessage = "Login failed. Please try again.";
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = "No account found with this email address.";
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = "Incorrect password. Please try again.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Please enter a valid email address.";
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = "This account has been disabled.";
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = "Too many failed attempts. Please try again later.";
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = "Network error. Please check your connection and try again.";
    }
    
    return { 
      user: null, 
      error: errorMessage,
      success: false
    };
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
