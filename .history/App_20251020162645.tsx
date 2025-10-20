/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';

const Stack = createNativeStackNavigator();

function normalizeUrl(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // 스킴이 없으면 https로 보정
  return `https://${trimmed}`;
}

function HomeScreen({ navigation }) {
  const [url, setUrl] = useState('');

  const onSubmit = () => {
    const finalUrl = normalizeUrl(url);
    try {
      // 간단 검증
      const u = new URL(finalUrl);
      navigation.navigate('Browser', { url: u.toString() });
    } catch (e) {
      Alert.alert('유효하지 않은 URL', '올바른 주소를 입력해 주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.flex}
      >
        <View style={styles.container}>
          <Text style={styles.label}>Open URL</Text>
          <TextInput
            value={url}
            onChangeText={setUrl}
            placeholder="예: https://naver.com 또는 naver.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            onSubmitEditing={onSubmit}
            style={styles.input}
          />

          <TouchableOpacity onPress={onSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function BrowserScreen({ route, navigation }) {
  const initialUrl = route.params?.url ?? 'https://example.com';

  // WebView가 내부 히스토리로 뒤로 갈 수 있을 때 하드웨어/제스처 백에 반응하려면 상태를 관리할 수도 있음
  // 여기서는 스택의 기본 "뒤로가기" 버튼(좌측 상단)을 사용합니다.
  const source = useMemo(() => ({ uri: initialUrl }), [initialUrl]);

  return (
    <SafeAreaView style={styles.safe}>
      <WebView
        source={source}
        startInLoadingState
        allowsBackForwardNavigationGestures
        // 필요 시 유저 에이전트/JS 허용 등 옵션 추가 가능
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '홈' }}
        />
        <Stack.Screen
          name="Browser"
          component={BrowserScreen}
          options={{
            title: '브라우저',
            // 좌측 상단 뒤로가기는 Native Stack이 자동으로 제공합니다.
            // 필요하면 아래처럼 커스텀도 가능:
            // headerLeft: ({canGoBack}) => (
            //   <TouchableOpacity onPress={() => navigation.goBack()}>
            //     <Text style={{fontSize:16}}>뒤로</Text>
            //   </TouchableOpacity>
            // ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  container: { flex: 1, padding: 20, gap: 14, justifyContent: 'center' },
  label: { fontSize: 16, color: '#333', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default App;
