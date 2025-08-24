import { Subscription } from '@/types';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { addDays, toISODate } from './date';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationSettings {
  reminderLeadTime: number; // days before renewal
  enabled: boolean;
}

export const DEFAULT_REMINDER_LEAD_TIME = 3;

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Schedule a renewal notification for a subscription
 */
export async function scheduleRenewalNotification(
  subscription: Subscription,
  leadTimeDays: number = DEFAULT_REMINDER_LEAD_TIME
): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    const renewalDate = new Date(subscription.renewal_date);
    const now = new Date();
    
    // If renewal date is in the past, calculate next cycle
    let notificationDate = renewalDate;
    if (renewalDate <= now) {
      switch (subscription.billing_cycle) {
        case 'weekly':
          notificationDate = addDays(renewalDate, 7);
          break;
        case 'monthly':
          notificationDate = addDays(renewalDate, 30);
          break;
        case 'yearly':
          notificationDate = addDays(renewalDate, 365);
          break;
        case 'custom':
          // For custom, assume monthly
          notificationDate = addDays(renewalDate, 30);
          break;
      }
    }
    
    // Calculate notification date (X days before renewal)
    const notificationDateAdjusted = addDays(notificationDate, -leadTimeDays);
    
    // If notification date is in the past, don't schedule
    if (notificationDateAdjusted <= now) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔄 Subscription Renewal Reminder',
        body: `${subscription.service_name} will renew in ${leadTimeDays} day${leadTimeDays > 1 ? 's' : ''} for ${subscription.currency} ${subscription.amount}`,
        data: {
          subscriptionId: subscription.id,
          serviceName: subscription.service_name,
          amount: subscription.amount,
          currency: subscription.currency,
          renewalDate: toISODate(notificationDate),
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notificationDateAdjusted,
      },
    });

    console.log(`Scheduled notification for ${subscription.service_name} on ${notificationDateAdjusted.toISOString()}`);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

/**
 * Cancel notification for a specific subscription
 */
export async function cancelNotificationFor(subscriptionId: string): Promise<void> {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.subscriptionId === subscriptionId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        console.log(`Cancelled notification for subscription ${subscriptionId}`);
      }
    }
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Cancelled all scheduled notifications');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}

/**
 * Show a local notification immediately (for testing)
 */
export async function showTestNotification(): Promise<void> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧪 Test Notification',
        body: 'This is a test notification from Loopay!',
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.error('Error showing test notification:', error);
  }
}

/**
 * Trigger haptic feedback
 */
export function triggerHaptic(type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy' = 'light'): void {
  try {
    switch (type) {
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  } catch (error) {
    console.error('Error triggering haptic feedback:', error);
  }
}
