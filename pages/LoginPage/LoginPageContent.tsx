import {
  authClient,
  signInWithGitHub,
  signInWithGoogle,
} from "@/lib/auth-client";
import {
  clearRememberedCredentials,
  getRememberedCredentials,
  saveRememberedCredentials,
} from "@/utils/rememberPassword";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useStore } from "zustand";
import { useLoginPageStore } from "./_store";

const getErrorMessage = (
  errorCode: string | undefined,
  errorDetails: string | undefined,
  t: (key: string) => string
): string => {
  if (!errorCode) return "";

  switch (errorCode) {
    case "oauth_failed": {
      return errorDetails
        ? `${t("login.oauthFailed")}: ${errorDetails}`
        : t("login.oauthFailed");
    }
    case "no_code": {
      return t("login.noCode");
    }
    default: {
      return `${t("login.loginError")}: ${errorCode}`;
    }
  }
};

export const LoginPageContent = () => {
  const searchParams = useLocalSearchParams() as {
    redirect?: string;
    error?: string;
    details?: string;
  };
  const { error, details } = searchParams;
  const router = useRouter();

  const { t } = useTranslation();
  const store = useLoginPageStore();
  const {
    showPassword,
    loginError,
    formData,
    setShowPassword,
    setLoginError,
    setFormData,
  } = useStore(store);

  // 页面加载时检查并填充记住的凭据
  useEffect(() => {
    const loadRemembered = async () => {
      const remembered = await getRememberedCredentials();
      if (remembered) {
        setFormData({
          email: remembered.email,
          password: remembered.password,
          rememberMe: true,
        });
      }
    };
    loadRemembered();
  }, [setFormData]);

  const handleSubmit = async () => {
    setLoginError(null); // 清除之前的错误
    try {
      const result = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });
      if (result.data) {
        // 登录成功，处理记住密码
        if (formData.rememberMe) {
          // 保存凭据，默认7天
          saveRememberedCredentials(formData.email, formData.password);
        } else {
          // 如果未勾选记住密码，清除已保存的凭据
          clearRememberedCredentials();
        }
        // 跳转到重定向页面或arena页面
        router.push({ pathname: "/(tabs)" });
      } else {
        // 处理登录失败
        setLoginError(t("login.loginFailed"));
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(t("login.loginError"));
    }
  };

  const errorMessage = getErrorMessage(error, details, t);

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      [name]: value,
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (value: boolean) => {
    setFormData({ rememberMe: value });
  };

  const handleGitHubLogin = () => {
    try {
      signInWithGitHub(searchParams.redirect);
    } catch (error) {
      console.error("Error in handleGitHubLogin:", error);
      Alert.alert("Error", "Failed to sign in with GitHub");
    }
  };

  const handleGoogleLogin = () => {
    try {
      signInWithGoogle(searchParams.redirect);
    } catch (error) {
      console.error("Error in handleGoogleLogin:", error);
      Alert.alert("Error", "Failed to sign in with Google");
    }
  };

  return (
    <ScrollView className="bg-gray-100" contentContainerClassName="flex-1 justify-center p-5">
      <View className="bg-white rounded-lg p-5 shadow-lg">
        <Text className="text-2xl font-bold text-center mb-5">{t("login.title")}</Text>

        {errorMessage ? (
          <View className="flex-row items-center bg-red-50 border border-red-200 rounded-md p-2.5 mb-2.5">
            <Ionicons name="alert-circle" size={20} color="red" />
            <Text className="text-red-600 ml-2.5">{errorMessage}</Text>
          </View>
        ) : null}
        {loginError ? (
          <View className="flex-row items-center bg-red-50 border border-red-200 rounded-md p-2.5 mb-2.5">
            <Ionicons name="alert-circle" size={20} color="red" />
            <Text className="text-red-600 ml-2.5">{loginError}</Text>
          </View>
        ) : null}

        <View className="mb-5">
          <Text className="text-base mb-1.5">{t("login.emailLabel")}</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2.5 mb-2.5"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text className="text-base mb-1.5">{t("login.passwordLabel")}</Text>
          <View className="relative">
            <TextInput
              className="border border-gray-300 rounded-md p-2.5 mb-2.5"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              className="absolute right-2.5 top-2.5"
              onPress={handleTogglePasswordVisibility}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity >
            <Text className="text-blue-600 text-right mb-2.5">{t("login.forgotPassword")}</Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-5">
            <TouchableOpacity
              className="mr-2.5"
              onPress={() => handleRememberMeChange(!formData.rememberMe)}
            >
              {formData.rememberMe ? (
                <Ionicons name="checkbox" size={20} color="cyan" />
              ) : (
                <Ionicons name="square-outline" size={20} color="gray" />
              )}
            </TouchableOpacity>
            <Text className="text-base">{t("login.rememberMe")}</Text>
          </View>

          <TouchableOpacity className="bg-blue-600 p-4 rounded-md items-center" onPress={handleSubmit}>
            <Text className="text-white text-base font-bold">{t("login.signIn")}</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-center my-5 text-base">{t("login.orSignInWith")}</Text>

        <TouchableOpacity className="flex-row items-center justify-center border border-gray-300 rounded-md p-4 mb-2.5" onPress={handleGoogleLogin}>
          <Ionicons name="mail" size={20} color="black" />
          <Text className="ml-2.5 text-base">{t("login.google")}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-center border border-gray-300 rounded-md p-4 mb-2.5" onPress={handleGitHubLogin}>
          <Ionicons name="logo-github" size={20} color="black" />
          <Text className="ml-2.5 text-base">{t("login.github")}</Text>
        </TouchableOpacity>

        {/* <View className="flex-row justify-center items-center">
          <Text className="text-base">{t("login.noAccount")}</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: "/register" })}>
            <Text className="text-blue-600">{t("login.registerNow")}</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ScrollView>
  );
};
