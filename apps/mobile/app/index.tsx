import { Redirect } from 'expo-router';

// The root auth guard in _layout.tsx handles the real redirect logic.
// This ensures the bare "/" route doesn't render a stale screen.
export default function Index() {
  return <Redirect href="/(tabs)/hub" />;
}
