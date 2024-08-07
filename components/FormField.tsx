import React from 'react';
import { View, TextInput, Text } from 'react-native';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  errorMessage?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, value, onChangeText, secureTextEntry, errorMessage }) => {
  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-700 mb-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        className={`border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
        placeholder={label}
        placeholderTextColor="#9ca3af"
      />
      {errorMessage ? (
        <Text className="text-red-500 text-sm mt-1">{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export default FormField;
