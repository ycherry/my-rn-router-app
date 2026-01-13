import AsyncStorage from '@react-native-async-storage/async-storage';

const EMAIL_KEY = 'remembered_email';
const PASSWORD_KEY = 'remembered_password';

export interface RememberedCredentials {
  email: string;
  password: string;
}

export const getRememberedCredentials = async (): Promise<RememberedCredentials | null> => {
  try {
    const email = await AsyncStorage.getItem(EMAIL_KEY);
    const password = await AsyncStorage.getItem(PASSWORD_KEY);
    if (email && password) {
      return { email, password };
    }
    return null;
  } catch (error) {
    console.error('Error getting remembered credentials:', error);
    return null;
  }
};

export const saveRememberedCredentials = async (email: string, password: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(EMAIL_KEY, email);
    await AsyncStorage.setItem(PASSWORD_KEY, password);
  } catch (error) {
    console.error('Error saving remembered credentials:', error);
  }
};

export const clearRememberedCredentials = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(EMAIL_KEY);
    await AsyncStorage.removeItem(PASSWORD_KEY);
  } catch (error) {
    console.error('Error clearing remembered credentials:', error);
  }
};