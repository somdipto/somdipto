import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type BrowserScreenRouteProp = RouteProp<RootStackParamList, 'Browser'>;

// Basic simulated agent that can interpret simple commands
// In a real implementation, this would connect to an LLM or use a more sophisticated automation library
const executeAgentCommand = (
  command: string,
  webViewRef: React.RefObject<WebView>,
) => {
  const lowerCmd = command.toLowerCase();

  if (lowerCmd.includes('search for')) {
    const query = command
      .substring(command.toLowerCase().indexOf('search for') + 10)
      .trim();
    const script = `
      (function() {
        const input = document.querySelector('input[name="q"], input[type="text"]');
        if (input) {
          input.value = "${query}";
          input.form ? input.form.submit() : input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
        } else {
          window.location.href = "https://www.google.com/search?q=${encodeURIComponent(query)}";
        }
      })();
    `;
    webViewRef.current?.injectJavaScript(script);
    return 'Executing search...';
  }

  if (lowerCmd.includes('click')) {
    const target = command
      .substring(command.toLowerCase().indexOf('click') + 5)
      .trim();
    const script = `
      (function() {
        const elements = Array.from(document.querySelectorAll('a, button, input[type="submit"], [role="button"]'));
        const target = elements.find(el => el.innerText.toLowerCase().includes("${target.toLowerCase()}") || el.textContent.toLowerCase().includes("${target.toLowerCase()}"));
        if (target) {
          target.click();
          window.ReactNativeWebView.postMessage("Clicked " + "${target}");
        } else {
           window.ReactNativeWebView.postMessage("Could not find element to click: " + "${target}");
        }
      })();
    `;
    webViewRef.current?.injectJavaScript(script);
    return `Attempting to click "${target}"...`;
  }

  if (lowerCmd.includes('go to')) {
    let url = command
      .substring(command.toLowerCase().indexOf('go to') + 5)
      .trim();
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    // We can't easily change the URL via injectJavaScript if it's a full navigation,
    // better to handle this in the parent component state if possible,
    // but window.location works too.
    const script = `window.location.href = "${url}";`;
    webViewRef.current?.injectJavaScript(script);
    return `Navigating to ${url}...`;
  }

  if (lowerCmd.includes('scroll down')) {
    const script = `window.scrollBy(0, 500);`;
    webViewRef.current?.injectJavaScript(script);
    return 'Scrolling down...';
  }

  return "Command not recognized. Try 'Search for...', 'Go to...', 'Click...', or 'Scroll down'.";
};

export default function BrowserScreen() {
  const route = useRoute<BrowserScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const initialUrl = route.params?.initialUrl || 'https://www.google.com';

  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [agentInput, setAgentInput] = useState('');
  const [agentStatus, setAgentStatus] = useState('Ready');
  const [loading, setLoading] = useState(false);

  const handleAgentSubmit = () => {
    if (!agentInput.trim()) return;

    setAgentStatus('Processing...');
    const result = executeAgentCommand(agentInput, webViewRef);
    setAgentStatus(result);
    setAgentInput('');

    // Reset status after a delay
    setTimeout(() => {
      if (result !== 'Command not recognized.') {
        setAgentStatus('Done.');
      }
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-row items-center p-2 border-b border-gray-200 dark:border-gray-800">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-3 p-2"
        >
          <Text className="text-blue-500">Back</Text>
        </TouchableOpacity>
        <TextInput
          className="flex-1 h-9 bg-gray-100 dark:bg-gray-900 rounded-lg px-3 text-black dark:text-white"
          value={currentUrl}
          onChangeText={setCurrentUrl}
          autoCapitalize="none"
          keyboardType="url"
          onSubmitEditing={(e) => {
            let url = e.nativeEvent.text;
            if (!url.startsWith('http')) url = 'https://' + url;
            setCurrentUrl(url);
          }}
        />
        {loading && <ActivityIndicator size="small" className="ml-2" />}
      </View>

      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        className="flex-1"
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      {/* Agent Control Panel */}
      <View className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 p-3">
        <Text className="text-xs text-blue-500 font-bold mb-1">
          AGENT: {agentStatus}
        </Text>
        <View className="flex-row items-center bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-2">
          <TextInput
            className="flex-1 text-black dark:text-white"
            placeholder="Ask agent to do something..."
            placeholderTextColor="#9CA3AF"
            value={agentInput}
            onChangeText={setAgentInput}
            onSubmitEditing={handleAgentSubmit}
          />
          <TouchableOpacity
            onPress={handleAgentSubmit}
            disabled={!agentInput.trim()}
          >
            <Text
              className={`font-bold ml-2 ${!agentInput.trim() ? 'text-gray-400' : 'text-blue-500'}`}
            >
              Go
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
