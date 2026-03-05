import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(focused: boolean, active: IconName, inactive: IconName) {
  return <Ionicons name={focused ? active : inactive} size={24} color={focused ? '#e94560' : '#6b6b8a'} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0f0f1a', borderTopColor: '#1a1a2e', borderTopWidth: 1 },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#6b6b8a',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="hub"
        options={{
          title: 'Match Day',
          tabBarIcon: ({ focused }) => tabIcon(focused, 'football', 'football-outline'),
        }}
      />
      <Tabs.Screen
        name="happy-hour"
        options={{
          title: 'Happy Hour',
          tabBarIcon: ({ focused }) => tabIcon(focused, 'beer', 'beer-outline'),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'City Nav',
          tabBarIcon: ({ focused }) => tabIcon(focused, 'map', 'map-outline'),
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Emergency',
          tabBarIcon: ({ focused }) => tabIcon(focused, 'shield', 'shield-outline'),
        }}
      />
      <Tabs.Screen
        name="language"
        options={{
          title: 'Language',
          tabBarIcon: ({ focused }) => tabIcon(focused, 'language', 'language-outline'),
        }}
      />
      <Tabs.Screen
        name="concierge"
        options={{
          title: 'Concierge',
          tabBarIcon: ({ focused }) => tabIcon(focused, 'sparkles', 'sparkles-outline'),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ focused }) => tabIcon(focused, 'bookmark', 'bookmark-outline'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => tabIcon(focused, 'person', 'person-outline'),
        }}
      />
    </Tabs>
  );
}
