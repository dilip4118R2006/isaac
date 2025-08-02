import { dataService } from './dataService';
import { firebaseService } from './firebaseService';
import { User, Component, BorrowRequest, Notification, LoginSession, SystemStats } from '../types';

/**
 * Hybrid Data Service that can work with both localStorage and Firebase
 * This allows for gradual migration and offline functionality
 */
class HybridDataService {
  private useFirebase: boolean = true;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineChanges();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  setFirebaseMode(enabled: boolean): void {
    this.useFirebase = enabled;
  }

  // User operations
  async getUser(identifier: string): Promise<User | undefined> {
    if (this.useFirebase && this.isOnline) {
      try {
        // Try to get by ID first, then by email
        let user = await firebaseService.getUser(identifier);
        if (!user) {
          user = await firebaseService.getUserByEmail(identifier);
        }
        return user || undefined;
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return dataService.getUser(identifier);
      }
    }
    return dataService.getUser(identifier);
  }

  async addUser(user: User): Promise<void> {
    if (this.useFirebase && this.isOnline) {
      try {
        await firebaseService.addUser(user);
      } catch (error) {
        console.error('Firebase error, saving to localStorage:', error);
        dataService.addUser(user);
      }
    } else {
      dataService.addUser(user);
    }
  }

  async updateUser(user: User): Promise<void> {
    if (this.useFirebase && this.isOnline) {
      try {
        await firebaseService.updateUser(user);
      } catch (error) {
        console.error('Firebase error, saving to localStorage:', error);
        dataService.updateUser(user);
      }
    } else {
      dataService.updateUser(user);
    }
  }

  // Component operations
  async getComponents(): Promise<Component[]> {
    if (this.useFirebase && this.isOnline) {
      try {
        return await firebaseService.getAllComponents();
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return dataService.getComponents();
      }
    }
    return dataService.getComponents();
  }

  async addComponent(component: Component): Promise<void> {
    if (this.useFirebase && this.isOnline) {
      try {
        await firebaseService.addComponent(component);
      } catch (error) {
        console.error('Firebase error, saving to localStorage:', error);
        dataService.addComponent(component);
      }
    } else {
      dataService.addComponent(component);
    }
  }

  async updateComponent(component: Component): Promise<void> {
    if (this.useFirebase && this.isOnline) {
      try {
        await firebaseService.updateComponent(component);
      } catch (error) {
        console.error('Firebase error, saving to localStorage:', error);
        dataService.updateComponent(component);
      }
    } else {
      dataService.updateComponent(component);
    }
  }

  async deleteComponent(componentId: string): Promise<void> {
    if (this.useFirebase && this.isOnline) {
      try {
        await firebaseService.deleteComponent(componentId);
      } catch (error) {
        console.error('Firebase error, saving to localStorage:', error);
        dataService.deleteComponent(componentId);
      }
    } else {
      dataService.deleteComponent(componentId);
    }
  }

  // Request operations
  async getRequests(): Promise<BorrowRequest[]> {
    if (this.useFirebase && this.isOnline) {
      try {
        return await firebaseService.getAllRequests();
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return dataService.getRequests();
      }
    }
    return dataService.getRequests();
  }

  async getUserRequests(userId: string): Promise<BorrowRequest[]> {
    if (this.useFirebase && this.isOnline) {
      try {
        return await firebaseService.getUserRequests(userId);
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return dataService.getUserRequests(userId);
      }
    }
    return dataService.getUserRequests(userId);
  }

  async addRequest(request: BorrowRequest): Promise<void> {
    if (this.useFirebase && this.isOnline) {
      try {
        await firebaseService.addRequest(request);
      } catch (error) {
        console.error('Firebase error, saving to localStorage:', error);
        dataService.addRequest(request);
      }
    } else {
      dataService.addRequest(request);
    }
  }

  async updateRequest(request: BorrowRequest): Promise<void> {
    if (this.useFirebase && this.isOnline) {
      try {
        await firebaseService.updateRequest(request);
      } catch (error) {
        console.error('Firebase error, saving to localStorage:', error);
        dataService.updateRequest(request);
      }
    } else {
      dataService.updateRequest(request);
    }
  }

  // Notification operations
  async getUserNotifications(userId: string): Promise<Notification[]> {
    if (this.useFirebase && this.isOnline) {
      try {
        return await firebaseService.getUserNotifications(userId);
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return dataService.getUserNotifications(userId);
      }
    }
    return dataService.getUserNotifications(userId);
  }

  async addNotification(notification: Notification): Promise<void> {
    if (this.useFirebase && this.isOnline) {
      try {
        await firebaseService.addNotification(notification);
      } catch (error) {
        console.error('Firebase error, saving to localStorage:', error);
        dataService.addNotification(notification);
      }
    } else {
      dataService.addNotification(notification);
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    if (this.useFirebase && this.isOnline) {
      try {
        await firebaseService.markNotificationAsRead(notificationId);
      } catch (error) {
        console.error('Firebase error, saving to localStorage:', error);
        dataService.markNotificationAsRead(notificationId);
      }
    } else {
      dataService.markNotificationAsRead(notificationId);
    }
  }

  // Login session operations
  async createLoginSession(user: User): Promise<LoginSession> {
    if (this.useFirebase && this.isOnline) {
      try {
        return await firebaseService.createLoginSession(user);
      } catch (error) {
        console.error('Firebase error, saving to localStorage:', error);
        return dataService.createLoginSession(user);
      }
    }
    return dataService.createLoginSession(user);
  }

  async endLoginSession(userId: string): Promise<void> {
    if (this.useFirebase && this.isOnline) {
      try {
        await firebaseService.endLoginSession(userId);
      } catch (error) {
        console.error('Firebase error, saving to localStorage:', error);
        dataService.endLoginSession(userId);
      }
    } else {
      dataService.endLoginSession(userId);
    }
  }

  async getLoginSessions(): Promise<LoginSession[]> {
    if (this.useFirebase && this.isOnline) {
      try {
        return await firebaseService.getAllLoginSessions();
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return dataService.getLoginSessions();
      }
    }
    return dataService.getLoginSessions();
  }

  // System statistics
  getSystemStats(): SystemStats {
    // For now, use localStorage stats as Firebase stats would require aggregation
    return dataService.getSystemStats();
  }

  // Data export
  exportLoginSessionsCSV(): string {
    return dataService.exportLoginSessionsCSV();
  }

  // Migration and sync methods
  async migrateToFirebase(): Promise<void> {
    try {
      await firebaseService.migrateLocalDataToFirebase();
      console.log('Migration to Firebase completed');
    } catch (error) {
      console.error('Migration to Firebase failed:', error);
    }
  }

  private async syncOfflineChanges(): Promise<void> {
    // This would sync any changes made while offline
    // Implementation depends on how you want to handle offline changes
    console.log('Syncing offline changes...');
  }

  // Real-time listeners (Firebase only)
  onComponentsChange(callback: (components: Component[]) => void): (() => void) | null {
    if (this.useFirebase && this.isOnline) {
      return firebaseService.onComponentsChange(callback);
    }
    return null;
  }

  onRequestsChange(callback: (requests: BorrowRequest[]) => void): (() => void) | null {
    if (this.useFirebase && this.isOnline) {
      return firebaseService.onRequestsChange(callback);
    }
    return null;
  }

  onUserNotificationsChange(userId: string, callback: (notifications: Notification[]) => void): (() => void) | null {
    if (this.useFirebase && this.isOnline) {
      return firebaseService.onUserNotificationsChange(userId, callback);
    }
    return null;
  }
}

export const hybridDataService = new HybridDataService();