import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  sendSignInLinkToEmail as fbSendSignInLinkToEmail,
  isSignInWithEmailLink as fbIsSignInWithEmailLink,
  signInWithEmailLink as fbSignInWithEmailLink,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  type User,
  type ActionCodeSettings
} from "firebase/auth";
import { 
  getFirestore, 
  collection as fbCollection, 
  doc as fbDoc, 
  setDoc as fbSetDoc, 
  getDoc as fbGetDoc, 
  getDocs as fbGetDocs, 
  addDoc as fbAddDoc, 
  query as fbQuery, 
  where as fbWhere, 
  orderBy as fbOrderBy, 
  onSnapshot as fbOnSnapshot
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Detect if we are running in simulator/local development with mock credentials
export const isMockMode = !firebaseConfig || firebaseConfig.apiKey === "MOCK_API_KEY";

// Real client initialization if not in Mock Mode
let appInstance;
let dbInstance: any;
let authInstance: any;

if (!isMockMode) {
  try {
    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    dbInstance = getFirestore(appInstance, firebaseConfig.firestoreDatabaseId);
    authInstance = getAuth(appInstance);
    console.log("Firebase initialized successfully with live database config.");
  } catch (error) {
    console.error("Firebase live initialization failed, falling back to local simulation:", error);
  }
}

export const app = appInstance;
export const db = dbInstance;
export const auth = authInstance;

// ========== UNIFIED AUTH INTERFACE ==========

export interface StandardUser {
  uid: string;
  email: string | null;
  createdAt?: string;
  lastLoginAt?: string;
}

type AuthCallback = (user: StandardUser | null) => void;

// Local Simulation Database structures
const LOCAL_USERS_KEY = "yala_smart_city_users";
const LOCAL_CURRENT_USER_KEY = "yala_smart_city_current_user";
const LOCAL_COMPLAINTS_KEY = "yala_smart_city_complaints";

const getLocalUsers = (): Record<string, StandardUser> => {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveLocalUsers = (users: Record<string, StandardUser>) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const getLocalCurrentUser = (): StandardUser | null => {
  try {
    const raw = localStorage.getItem(LOCAL_CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setLocalCurrentUser = (user: StandardUser | null) => {
  if (user) {
    localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_CURRENT_USER_KEY);
  }
};

// Listeners collection for Auth State
const authListeners: Set<AuthCallback> = new Set();

export const onAuthStateChanged = (callback: AuthCallback) => {
  if (!isMockMode && authInstance) {
    return fbOnAuthStateChanged(authInstance, (fbUser) => {
      if (fbUser) {
        callback({
          uid: fbUser.uid,
          email: fbUser.email,
        });
      } else {
        callback(null);
      }
    });
  } else {
    authListeners.add(callback);
    // Trigger initial auth check
    const current = getLocalCurrentUser();
    callback(current);
    return () => {
      authListeners.delete(callback);
    };
  }
};

export const sendSignInLinkToEmail = async (email: string, actionCodeSettings?: ActionCodeSettings) => {
  if (!isMockMode && authInstance) {
    const settings = actionCodeSettings || {
      url: window.location.href,
      handleCodeInApp: true
    };
    await fbSendSignInLinkToEmail(authInstance, email, settings);
  } else {
    console.log(`[MockAuth] Sending passwordless magic link to ${email}`);
    // Simulate real delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // Set simulated pending email
    localStorage.setItem("yala_pending_signin_email", email);
  }
};

export const isSignInWithEmailLink = (href: string): boolean => {
  if (!isMockMode && authInstance) {
    return fbIsSignInWithEmailLink(authInstance, href);
  } else {
    // Look for simulation URL params
    const url = new URL(href);
    return url.searchParams.has("mockSignIn") || url.searchParams.has("apiKey");
  }
};

export const signInWithEmailLink = async (email: string, href: string): Promise<StandardUser> => {
  if (!isMockMode && authInstance) {
    const result = await fbSignInWithEmailLink(authInstance, email, href);
    const user = result.user;
    
    // Save to Firestore users collection
    const userData = {
      userId: user.uid,
      email: user.email,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      sessionInfo: navigator.userAgent
    };
    
    try {
      await fbSetDoc(fbDoc(dbInstance, "users", user.uid), userData);
    } catch (e) {
      console.warn("Failed recording user record to Firestore:", e);
    }

    return {
      uid: user.uid,
      email: user.email,
    };
  } else {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getLocalUsers();
    let foundUser = Object.values(users).find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      const uid = "usr-" + Math.random().toString(36).substr(2, 9);
      foundUser = {
        uid,
        email,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      users[uid] = foundUser;
      saveLocalUsers(users);
    } else {
      foundUser.lastLoginAt = new Date().toISOString();
      users[foundUser.uid] = foundUser;
      saveLocalUsers(users);
    }

    setLocalCurrentUser(foundUser);
    
    // Notify in-process listeners
    authListeners.forEach(cb => cb(foundUser));
    return foundUser;
  }
};

export const signOut = async () => {
  if (!isMockMode && authInstance) {
    await fbSignOut(authInstance);
  } else {
    setLocalCurrentUser(null);
    authListeners.forEach(cb => cb(null));
  }
};

// ========== UNIFIED FIRESTORE / DATA PERSISTENCE INTERFACE ==========

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authInstance?.currentUser?.uid || null,
      email: authInstance?.currentUser?.email || null,
      emailVerified: authInstance?.currentUser?.emailVerified || null,
      isAnonymous: authInstance?.currentUser?.isAnonymous || null,
      tenantId: authInstance?.currentUser?.tenantId || null,
      providerInfo: authInstance?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const syncUserProfileAndComplaints = async (user: StandardUser) => {
  if (isMockMode) return;
  // If online, optionally push profile updates or sync
};

export const dbSaveComplaint = async (complaintData: any): Promise<any> => {
  if (!isMockMode && dbInstance) {
    try {
      // Save to Firestore database
      await fbSetDoc(fbDoc(dbInstance, "complaints", complaintData.id), complaintData);
      return complaintData;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `complaints/${complaintData.id}`);
    }
  } else {
    // Save to LocalStorage persistent array
    const complaints = dbGetComplaintsLocal();
    complaints.unshift(complaintData);
    localStorage.setItem(LOCAL_COMPLAINTS_KEY, JSON.stringify(complaints));
    return complaintData;
  }
};

export const dbGetComplaintsLocal = (): any[] => {
  try {
    const raw = localStorage.getItem(LOCAL_COMPLAINTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const dbGetComplaints = async (userId?: string): Promise<any[]> => {
  if (!isMockMode && dbInstance) {
    if (!userId) {
      // Return empty list of complaints for unauthenticated / guest sessions
      return [];
    }
    try {
      const complaintsCol = fbCollection(dbInstance, "complaints");
      const q = fbQuery(complaintsCol, fbWhere("userId", "==", userId));
      const querySnapshot = await fbGetDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      return list;
    } catch (e) {
      console.error("Firestore retrieval failed, reading local:", e);
      handleFirestoreError(e, OperationType.LIST, "complaints");
      return dbGetComplaintsLocal();
    }
  } else {
    const localList = dbGetComplaintsLocal();
    if (userId) {
      return localList.filter(c => c.userId === userId);
    }
    return localList;
  }
};

export const dbUpdateComplaintStatus = async (complaintId: string, status: string, note: string): Promise<any> => {
  const d = new Date();
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const newLog = {
    status,
    date: dateStr,
    note
  };

  if (!isMockMode && dbInstance) {
    try {
      const docRef = fbDoc(dbInstance, "complaints", complaintId);
      const existingSnap = await fbGetDoc(docRef);
      if (existingSnap.exists()) {
        const data = existingSnap.data();
        const updatedLogs = [...(data.progressLog || []), newLog];
        const updatedData = {
          ...data,
          status,
          progressLog: updatedLogs
        };
        await fbSetDoc(docRef, updatedData);
        return updatedData;
      }
      throw new Error(`Complaint ${complaintId} does not exist in Cloud Firestore.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `complaints/${complaintId}`);
    }
  } else {
    const localList = dbGetComplaintsLocal();
    let updatedComplaint: any = null;
    const newList = localList.map(c => {
      if (c.id === complaintId) {
        updatedComplaint = {
          ...c,
          status,
          progressLog: [...(c.progressLog || []), newLog]
        };
        return updatedComplaint;
      }
      return c;
    });
    if (updatedComplaint) {
      localStorage.setItem(LOCAL_COMPLAINTS_KEY, JSON.stringify(newList));
      return updatedComplaint;
    }
    return null;
  }
};
