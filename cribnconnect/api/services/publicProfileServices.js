import api from "../api";

// Get all public profiles
export const getAllPublicProfiles = async () => {
  try {
    const response = await api.get("/public-profiles");
    return response.data;
  } catch (error) {
    console.error("Error fetching all public profiles:", error);
    throw error;
  }
};

// Get current user's public profile
export const getCurrentUserProfile = async () => {
  try {
    const response = await api.get("/public-profiles/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw error;
  }
};

// Get public profile by UID
export const getPublicProfileById = async (uid) => {
  try {
    const response = await api.get(`/public-profiles/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching public profile by ID:", error);
    throw error;
  }
};

// Get user data (fallback if no public profile)
export const getUserById = async (uid) => {
  try {
    const response = await api.get(`/users/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

// Combined function to get user data (tries public profile first, then user data)
export const getUserData = async (uid) => {
  try {
    // Try to get public profile first
    const publicProfile = await getPublicProfileById(uid);
    return {
      source: 'publicProfile',
      data: publicProfile
    };
  } catch (error) {
    // If public profile not found, try user endpoint
    try {
      const userData = await getUserById(uid);
      return {
        source: 'user',
        data: userData
      };
    } catch (userError) {
      console.error("Error fetching user data from both endpoints:", userError);
      throw userError;
    }
  }
};

// Edit public profile
export const editPublicProfile = async (uid, profileData) => {
  try {
    const formData = new FormData();
    
    // Append all profile data to FormData
    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    });
    
    const response = await api.put(`/public-profiles/${uid}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing public profile:", error);
    throw error;
  }
};
