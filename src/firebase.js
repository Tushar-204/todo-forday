import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4nrtTLiRr6bkl1QlvIFqh03ehu9GzcL4",
  authDomain: "daily-todo-app-c3d51.firebaseapp.com",
  projectId: "daily-todo-app-c3d51",
  storageBucket: "daily-todo-app-c3d51.firebasestorage.app",
  messagingSenderId: "1062358167010",
  appId: "1:1062358167010:web:97a3141624cfffa8c79dbb",
  measurementId: "G-PKT0V28EZ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Authentication Functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};

// Profile Management Functions
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Also update Firebase Auth profile if displayName changed
    const user = auth.currentUser;
    if (user && profileData.displayName) {
      await updateProfile(user, {
        displayName: profileData.displayName
      });
    }

    console.log('Profile updated successfully');
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Initialize profile if it doesn't exist
      const user = auth.currentUser;
      const initialProfile = {
        email: user?.email || '',
        displayName: user?.displayName || '',
        photoURL: user?.photoURL || '',
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, initialProfile);
      return initialProfile;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const checkUsernameAvailability = async (username, currentUserId) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    // Username is available if no documents found, or if the only document is the current user
    if (querySnapshot.empty) return true;
    if (querySnapshot.size === 1 && querySnapshot.docs[0].id === currentUserId) return true;
    return false;
  } catch (error) {
    console.error("Error checking username:", error);
    throw error;
  }
};

// Firestore Functions
export const saveTasks = async (userId, tasks) => {
  try {
    const tasksRef = doc(db, 'users', userId, 'tasks', 'allTasks');
    await setDoc(tasksRef, {
      tasks: tasks,
      lastUpdated: new Date().toISOString()
    });
    console.log('Tasks saved to Firestore');
  } catch (error) {
    console.error("Error saving tasks:", error);
    throw error;
  }
};

export const getTasks = async (userId) => {
  try {
    const tasksRef = doc(db, 'users', userId, 'tasks', 'allTasks');
    const docSnap = await getDoc(tasksRef);

    if (docSnap.exists()) {
      return docSnap.data().tasks || {};
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error getting tasks:", error);
    throw error;
  }
};

export const shareTaskList = async (userId, date, tasks) => {
  try {
    const shareId = `${userId}_${date}_${Date.now()}`;
    const shareRef = doc(db, 'shared', shareId);

    await setDoc(shareRef, {
      userId: userId,
      date: date,
      tasks: tasks,
      sharedAt: new Date().toISOString()
    });

    return shareId;
  } catch (error) {
    console.error("Error sharing tasks:", error);
    throw error;
  }
};

export const getSharedTasks = async (shareId) => {
  try {
    const shareRef = doc(db, 'shared', shareId);
    const docSnap = await getDoc(shareRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting shared tasks:", error);
    throw error;
  }
};

export { auth, db };