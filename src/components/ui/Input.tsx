import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: 'default' | 'email' | 'password' | 'phone' | 'numeric';
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  showPasswordToggle?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const colors = {
  primary: '#1a1a2e',
  bg: '#ffffff',
  surface: '#f8fafc',
  border: '#e2e8f0',
  borderFocus: '#1a1a2e',
  borderError: '#ef4444',
  text: '#1a1a2e',
  textSecondary: '#64748b',
  textError: '#ef4444',
  placeholder: '#9ca3af',
};

export default function Input({
  label,
  error,
  hint,
  required = false,
  type = 'default',
  containerStyle,
  labelStyle,
  inputStyle,
  showPasswordToggle = false,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const hasError = !!error;
  
  // Configure input props based on type
  let inputProps: Partial<TextInputProps> = {};
  switch (type) {
    case 'email':
      inputProps = {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        autoComplete: 'email',
        textContentType: 'emailAddress',
      };
      break;
    case 'password':
      inputProps = {
        secureTextEntry: !showPassword,
        autoCapitalize: 'none',
        autoComplete: 'password',
        textContentType: 'password',
      };
      break;
    case 'phone':
      inputProps = {
        keyboardType: 'phone-pad',
        textContentType: 'telephoneNumber',
        autoComplete: 'tel',
      };
      break;
    case 'numeric':
      inputProps = {
        keyboardType: 'numeric',
      };
      break;
  }

  const containerStyles = [
    styles.container,
    containerStyle,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    isFocused && styles.inputContainerFocused,
    hasError && styles.inputContainerError,
  ];

  const textInputStyles = [
    styles.input,
    leftIcon && styles.inputWithLeftIcon,
    (rightIcon || (isPassword && showPasswordToggle)) && styles.inputWithRightIcon,
    inputStyle,
  ];

  const labelStyles = [
    styles.label,
    required && styles.labelRequired,
    hasError && styles.labelError,
    labelStyle,
  ];

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={labelStyles}>
          {label}{required && ' *'}
        </Text>
      )}
      
      <View style={inputContainerStyles}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={textInputStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.placeholder}
          {...inputProps}
          {...props}
        />
        
        {isPassword && showPasswordToggle && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={() => setShowPassword(!showPassword)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <Text style={styles.passwordToggle}>
              {showPassword ? '=H' : '=A'}
            </Text>
          </TouchableOpacity>
        )}
        
        {rightIcon && !isPassword && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {hint && !error && (
        <Text style={styles.hintText}>{hint}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  labelRequired: {
    color: colors.text,
  },
  labelError: {
    color: colors.textError,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.bg,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: colors.borderFocus,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: colors.borderError,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIconContainer: {
    paddingLeft: 12,
    paddingRight: 4,
  },
  rightIconContainer: {
    paddingRight: 12,
    paddingLeft: 4,
  },
  passwordToggle: {
    fontSize: 18,
  },
  errorText: {
    fontSize: 14,
    color: colors.textError,
    marginTop: 4,
  },
  hintText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});