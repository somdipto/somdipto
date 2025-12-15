import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useStore } from '@/store/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Root: undefined;
  Thread: { threadId: string };
};

type ThreadScreenRouteProp = RouteProp<RootStackParamList, 'Thread'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ThreadScreen() {
  const route = useRoute<ThreadScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { threadId } = route.params;
  const { threads, addMessage } = useStore();
  const thread = threads.find((t) => t.id === threadId);

  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    addMessage(threadId, { role: 'user', content: input });
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      addMessage(threadId, {
        role: 'assistant',
        content: `This is a simulated response to "${input}". In a real app, this would connect to an LLM API.`,
      });
    }, 1000);
  };

  useEffect(() => {
    if (!thread) {
      navigation.goBack();
    }
  }, [thread, navigation]);

  if (!thread) return null;

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="p-4 border-b border-gray-200 dark:border-gray-800 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Text className="text-blue-500 text-lg">Back</Text>
        </TouchableOpacity>
        <Text
          className="text-lg font-bold text-black dark:text-white truncate flex-1"
          numberOfLines={1}
        >
          {thread.title}
        </Text>
      </View>

      <FlatList
        data={thread.messages}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4"
        contentContainerClassName="py-5"
        renderItem={({ item }) => (
          <View
            className={`mb-4 ${item.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`p-3 rounded-lg max-w-[80%] ${
                item.role === 'user'
                  ? 'bg-blue-500'
                  : 'bg-gray-200 dark:bg-gray-800'
              }`}
            >
              <Text
                className={`${item.role === 'user' ? 'text-white' : 'text-black dark:text-white'}`}
              >
                {item.content}
              </Text>
            </View>
          </View>
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="border-t border-gray-200 dark:border-gray-800 p-4"
      >
        <View className="flex-row items-center bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-2">
          <TextInput
            className="flex-1 text-black dark:text-white h-10"
            placeholder="Ask follow-up..."
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity onPress={handleSend} disabled={!input.trim()}>
            <Text
              className={`font-bold ml-2 ${!input.trim() ? 'text-gray-400' : 'text-blue-500'}`}
            >
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
