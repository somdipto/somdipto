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

  const openBrowser = () => {
    navigation.navigate('Browser', {});
  };

  useEffect(() => {
    if (activeThreadId) {
      const state = useStore.getState();
      if (state.activeThreadId) {
        navigation.navigate('Thread', { threadId: state.activeThreadId });
      }
    }
  }, [activeThreadId, navigation]);

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

        <View className="mt-8 items-center">
          <TouchableOpacity
            onPress={openBrowser}
            className="bg-blue-500 rounded-full px-6 py-3"
          >
            <Text className="text-white font-bold">Open Browser Agent</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
