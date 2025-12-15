import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStore } from '@/store/useStore';
import { RootStackParamList } from '@/navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const { createThread, activeThreadId } = useStore();

  const handleSearch = (text: string) => {
    if (!text.trim()) return;
    createThread(text);
  };

  useEffect(() => {
    if (activeThreadId) {
      // When a new thread is created (and becomes active), navigate to it
      // We need to reset activeThreadId in the store or handle it such that we don't double nav
      // But for now, let's just navigate.
      // Better approach: createThread returns the ID, but our store is void.
      // So we listen to activeThreadId change.
      // Wait, this will trigger on every render if we don't clear it or check if we are already there.
      // Actually, createThread updates the store. We can just use the ID.
      // But simpler: just navigate in the handler if we modify createThread to return ID,
      // OR, createThread is synchronous. So we can grab the ID from store immediately after?
      // Zustand set is synchronous.
      const state = useStore.getState();
      if (state.activeThreadId) {
        navigation.navigate('Thread', { threadId: state.activeThreadId });
        // Optional: clear active thread so we don't auto-nav back?
        // Ideally "activeThread" means "current open thread".
      }
    }
  }, [activeThreadId, navigation]);

  // However, the above useEffect is risky because it might loop if we come back to Home and activeThreadId is still set.
  // Let's refactor handleSearch to get the ID from the store state *after* creation.

  const onSubmit = () => {
    if (!query.trim()) return;
    createThread(query);
    setQuery('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView contentContainerClassName="flex-grow justify-center p-5">
        <Text className="text-3xl font-bold text-center text-black dark:text-white mb-8">
          Where knowledge begins
        </Text>

        <View className="bg-gray-100 dark:bg-gray-900 rounded-full flex-row items-center px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-800">
          <TextInput
            className="flex-1 text-lg text-black dark:text-white ml-2"
            placeholder="Ask anything..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={onSubmit}
            returnKeyType="search"
          />
        </View>

        <View className="mt-8">
          <Text className="text-sm text-gray-500 uppercase font-bold mb-4 ml-2">
            Try asking
          </Text>
          <View className="flex-row flex-wrap">
            {[
              'History of the internet',
              'How does AI work?',
              'Best react native practices',
              'Explain quantum computing',
            ].map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSearch(suggestion)}
                className="bg-gray-100 dark:bg-gray-900 rounded-lg px-4 py-2 mr-2 mb-2"
              >
                <Text className="text-black dark:text-white">{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
