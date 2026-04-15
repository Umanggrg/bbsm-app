/**
 * Tab navigator layout — Apple iOS 16 style tab bar
 */
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  name: IoniconName;
  focused: boolean;
  label: string;
}

function TabIcon({ name, focused, label }: TabIconProps) {
  return (
    <View style={styles.iconWrapper}>
      <Ionicons
        name={name}
        size={24}
        color={focused ? Colors.tabBarActive : Colors.tabBarInactive}
      />
      <Text
        style={[styles.label, { color: focused ? Colors.tabBarActive : Colors.tabBarInactive }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: 'Offers',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'pricetag' : 'pricetag-outline'} focused={focused} label="Offers" />
          ),
        }}
      />
      <Tabs.Screen
        name="stores"
        options={{
          title: 'Stores',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'storefront' : 'storefront-outline'} focused={focused} label="Stores" />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: 'Shopping',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'cart' : 'cart-outline'} focused={focused} label="Shop" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(60, 60, 67, 0.2)',
    height: Platform.OS === 'ios' ? 80 : 64,
    paddingBottom: Platform.OS === 'ios' ? 22 : 6,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 12,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    width: 64,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Sora_500Medium',
    letterSpacing: 0,
  },
});
