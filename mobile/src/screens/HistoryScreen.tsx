import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useStore } from '@/store/useStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HistoryScreen() {
  const { threads, setActiveThread } = useStore();
  const navigation = useNavigation<NavigationProp>();

  const handlePress = (threadId: string) => {
    setActiveThread(threadId);
    navigation.navigate('Thread', { threadId });
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Text className="text-2xl font-bold text-black dark:text-white">
          Library
        </Text>
      </View>
      {threads.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">No history yet.</Text>
        </View>
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePress(item.id)}
              className="p-4 border-b border-gray-100 dark:border-gray-900 flex-row justify-between items-center"
            >
              <View className="flex-1">
                <Text
                  className="text-black dark:text-white font-semibold truncate"
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
                  {item.messages[item.messages.length - 1].content}
                </Text>
              </View>
              <Text className="text-gray-400 text-xs ml-2">
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
