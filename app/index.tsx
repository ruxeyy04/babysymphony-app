import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
export default function App() {
  return (
    <View className='flex-1 bg-[#1f1f1f] items-center justify-center'>
      <Text className="text-3xl text-blue-600">LullaBy</Text>
      <StatusBar style="auto" />
      <Link href="/profile" className='text-white'>Go to profile</Link>
      
    </View>
  );
}
