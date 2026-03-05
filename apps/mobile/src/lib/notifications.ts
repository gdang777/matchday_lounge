// notifications.ts
// Helpers for requesting push-notification permission, registering the Expo
// FCM token with our backend, and handling foreground notifications.
//
// Call `registerForPushNotifications()` once after the user signs in.
// Call `unregisterPushToken()` just before the user signs out.

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import api from './api';

// ─── Foreground notification behaviour ───────────────────────────────────────
// Show the alert / sound / badge even when the app is open.
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// ─── Android notification channel ────────────────────────────────────────────
export async function ensureAndroidChannel(): Promise<void> {
    if (Platform.OS !== 'android') return;
    await Notifications.setNotificationChannelAsync('matchday-alerts', {
        name: 'Match Day Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#e94560',
        sound: 'default',
    });
}

// ─── Request permission & get token ──────────────────────────────────────────
export async function registerForPushNotifications(): Promise<string | null> {
    // Push notifications only work on real devices
    if (!Device.isDevice) {
        console.warn('[notifications] Push is unavailable in the simulator.');
        return null;
    }

    await ensureAndroidChannel();

    // Check / request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.warn('[notifications] Push permission denied by user.');
        return null;
    }

    // Get the Expo push token (wraps FCM / APNs)
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    // Persist token to our backend → stored in Firestore for the Cloud Function
    try {
        await api.post('/api/users/fcm-token', { token });
        console.log('[notifications] FCM token registered:', token.slice(0, 30) + '…');
    } catch (err) {
        console.warn('[notifications] Failed to register FCM token with backend:', err);
    }

    return token;
}

// ─── Unregister on sign-out ────────────────────────────────────────────────
export async function unregisterPushToken(): Promise<void> {
    try {
        await api.delete('/api/users/fcm-token');
        console.log('[notifications] FCM token unregistered.');
    } catch (err) {
        console.warn('[notifications] Failed to unregister FCM token:', err);
    }
}
