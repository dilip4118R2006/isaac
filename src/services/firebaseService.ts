import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { User, Component, BorrowRequest, Notification, LoginSession, SystemData } from '../types';

class FirebaseService {
  private static instance: FirebaseService;

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // Authentication methods
  async signUp(email: string, password: string, userData: Partial<User>): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const newUser: User = {
        id: firebaseUser.uid,
        name: userData.name || '',
        email: firebaseUser.email || '',
        role: userData.role || 'student',
        rollNo: userData.rollNo,
        mobile: userData.mobile,
        registeredAt: new Date().toISOString(),
        loginCount: 1,
        isActive: true,
        lastLoginAt: new Date().toISOString()
      };

      // Save user data to Firestore
      await this.addUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Error signing up:', error);
      return null;
    }
  }

  async signIn(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const user = await this.getUser(firebaseUser.uid);
      if (user) {
        // Update login statistics
        await this.updateUserLoginStats(user.id);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error signing in:', error);
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // User operations
  async addUser(user: User): Promise<void> {
    try {
      await doc(db, 'users', user.id);
      await updateDoc(doc(db, 'users', user.id), {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async updateUser(user: User): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', user.id), {
        ...user,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  async updateUserLoginStats(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        await updateDoc(userRef, {
          loginCount: (userData.loginCount || 0) + 1,
          lastLoginAt: new Date().toISOString(),
          isActive: true,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating user login stats:', error);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Component operations
  async addComponent(component: Component): Promise<void> {
    try {
      await addDoc(collection(db, 'components'), {
        ...component,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding component:', error);
    }
  }

  async updateComponent(component: Component): Promise<void> {
    try {
      const q = query(collection(db, 'components'), where('id', '==', component.id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const componentDoc = querySnapshot.docs[0];
        await updateDoc(componentDoc.ref, {
          ...component,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating component:', error);
    }
  }

  async deleteComponent(componentId: string): Promise<void> {
    try {
      const q = query(collection(db, 'components'), where('id', '==', componentId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const componentDoc = querySnapshot.docs[0];
        await deleteDoc(componentDoc.ref);
      }
    } catch (error) {
      console.error('Error deleting component:', error);
    }
  }

  async getAllComponents(): Promise<Component[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'components'));
      return querySnapshot.docs.map(doc => ({ ...doc.data() } as Component));
    } catch (error) {
      console.error('Error getting components:', error);
      return [];
    }
  }

  // Request operations
  async addRequest(request: BorrowRequest): Promise<void> {
    try {
      await addDoc(collection(db, 'requests'), {
        ...request,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding request:', error);
    }
  }

  async updateRequest(request: BorrowRequest): Promise<void> {
    try {
      const q = query(collection(db, 'requests'), where('id', '==', request.id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const requestDoc = querySnapshot.docs[0];
        await updateDoc(requestDoc.ref, {
          ...request,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  }

  async getAllRequests(): Promise<BorrowRequest[]> {
    try {
      const q = query(collection(db, 'requests'), orderBy('requestDate', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ ...doc.data() } as BorrowRequest));
    } catch (error) {
      console.error('Error getting requests:', error);
      return [];
    }
  }

  async getUserRequests(userId: string): Promise<BorrowRequest[]> {
    try {
      const q = query(
        collection(db, 'requests'),
        where('studentId', '==', userId),
        orderBy('requestDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ ...doc.data() } as BorrowRequest));
    } catch (error) {
      console.error('Error getting user requests:', error);
      return [];
    }
  }

  // Notification operations
  async addNotification(notification: Notification): Promise<void> {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ ...doc.data() } as Notification));
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const q = query(collection(db, 'notifications'), where('id', '==', notificationId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const notificationDoc = querySnapshot.docs[0];
        await updateDoc(notificationDoc.ref, {
          read: true,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Login session operations
  async createLoginSession(user: User): Promise<LoginSession> {
    const session: LoginSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      userRole: user.role,
      loginTime: new Date().toISOString(),
      ipAddress: 'Unknown', // Would be set by backend in production
      userAgent: navigator.userAgent,
      deviceInfo: this.getDeviceInfo(),
      isActive: true
    };

    try {
      await addDoc(collection(db, 'loginSessions'), {
        ...session,
        createdAt: serverTimestamp()
      });
      return session;
    } catch (error) {
      console.error('Error creating login session:', error);
      return session;
    }
  }

  async endLoginSession(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'loginSessions'),
        where('userId', '==', userId),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.docs.forEach(doc => {
        const sessionData = doc.data() as LoginSession;
        batch.update(doc.ref, {
          logoutTime: new Date().toISOString(),
          isActive: false,
          sessionDuration: new Date().getTime() - new Date(sessionData.loginTime).getTime(),
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error ending login session:', error);
    }
  }

  async getAllLoginSessions(): Promise<LoginSession[]> {
    try {
      const q = query(collection(db, 'loginSessions'), orderBy('loginTime', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ ...doc.data() } as LoginSession));
    } catch (error) {
      console.error('Error getting login sessions:', error);
      return [];
    }
  }

  // Real-time listeners
  onComponentsChange(callback: (components: Component[]) => void): () => void {
    return onSnapshot(collection(db, 'components'), (snapshot) => {
      const components = snapshot.docs.map(doc => ({ ...doc.data() } as Component));
      callback(components);
    });
  }

  onRequestsChange(callback: (requests: BorrowRequest[]) => void): () => void {
    const q = query(collection(db, 'requests'), orderBy('requestDate', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({ ...doc.data() } as BorrowRequest));
      callback(requests);
    });
  }

  onUserNotificationsChange(userId: string, callback: (notifications: Notification[]) => void): () => void {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({ ...doc.data() } as Notification));
      callback(notifications);
    });
  }

  // Utility methods
  private getDeviceInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Mobile')) return 'Mobile Device';
    if (ua.includes('Tablet')) return 'Tablet';
    return 'Desktop';
  }

  // Data migration from localStorage to Firebase
  async migrateLocalDataToFirebase(): Promise<void> {
    try {
      const localData = localStorage.getItem('isaacLabData');
      if (!localData) return;

      const data: SystemData = JSON.parse(localData);
      
      // Migrate users (skip, as they should be created through authentication)
      
      // Migrate components
      for (const component of data.components) {
        await this.addComponent(component);
      }

      // Migrate requests
      for (const request of data.requests) {
        await this.addRequest(request);
      }

      // Migrate notifications
      for (const notification of data.notifications) {
        await this.addNotification(notification);
      }

      console.log('Data migration completed successfully');
    } catch (error) {
      console.error('Error migrating data to Firebase:', error);
    }
  }
}

export const firebaseService = FirebaseService.getInstance();