import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { RC4, RC4File } from './rc4modified';

export default function App() {
  const [inputType, setInputType] = useState('text'); // 'text' or 'file'
  const [text, setText] = useState('');
  const [fileUri, setFileUri] = useState(null);
  const [key, setKey] = useState('');
  const [outputText, setOutputText] = useState('');
  const [encryptedFile, setEncryptedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleTextChange = (value) => {
    setText(value);
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (result.type === 'success') {
        setFileUri(result.uri);
      }
      console.log(result.type);
    } catch (error) {
      console.log('Error picking file:', error);
    }
  };

  const handleEncrypt = async () => {
    // Logic to perform encryption based on 'text' or 'fileUri'
    if (inputType === 'text') {
      const encryptedText = RC4(text, key);
      setOutputText(encryptedText);
    } else if (inputType === 'file') {
      try {
        //const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
        //console.log(fileContent);
        const encryptedFileData = RC4File(fileUri, key);
        setEncryptedFile(encryptedFileData);
      } catch (error) {
        console.log('Error reading file:', error);
      }
    }
    console.log('Encrypting...');
  };

  const handleDecrypt = () => {
    // Logic to perform decryption based on 'text' or 'fileUri'
    if (inputType === 'text') {
      const decryptedText = RC4(text, key);
      setOutputText(decryptedText);
    console.log('Decrypting...');
    }
  };

  const handleDownload = async () => {
    try {
      const fileExtension = fileUri.split('.').pop();
      const encryptedFileName = `${fileUri.split('.')[0]}_encrypted.${fileExtension}`;
      console.log(encryptedFileName);
      
      // Create directory for saving the encrypted file
      const directory = `${FileSystem.documentDirectory}encrypted_files/`;
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      
      // Write encrypted file to the directory
      const encryptedFilePath = `${directory}${encryptedFileName}`;
      await FileSystem.writeAsStringAsync(encryptedFilePath, encryptedFile.toString(), { encoding: FileSystem.EncodingType.Base64 });
      console.log(encryptedFilePath);

      // Open file for download
      await FileSystem.downloadAsync(encryptedFilePath, FileSystem.documentDirectory + encryptedFileName);
    } catch (error) {
      console.log('Error downloading encrypted file:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputTypeContainer}>
        <TouchableOpacity onPress={() => setInputType('text')} style={[styles.inputTypeButton, inputType === 'text' && styles.selectedInputTypeButton]}>
          <Text style={styles.inputTypeButtonText}>Text Input</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setInputType('file')} style={[styles.inputTypeButton, inputType === 'file' && styles.selectedInputTypeButton]}>
          <Text style={styles.inputTypeButtonText}>File Input</Text>
        </TouchableOpacity>
      </View>
      {inputType === 'text' ? (
        <TextInput
          style={styles.input}
          onChangeText={handleTextChange}
          value={text}
          placeholder="Enter text..."
          multiline={true}
        />
      ) : (
        <Button title="Choose File" onPress={handleFilePick} />
      )}
      <TextInput
        style={styles.input}
        onChangeText={setKey}
        value={key}
        placeholder="Enter encryption key..."
        secureTextEntry={false}
      />
      <View style={styles.modeContainer}>
        <Button title="Encrypt" onPress={handleEncrypt} />
        <Button title="Decrypt" onPress={handleDecrypt} />
      </View>
      {inputType === 'text' && (
        <TextInput
          style={[styles.input, styles.output]}
          value={outputText}
          placeholder="Output"
          multiline={true}
          editable={false}
        />
      )}
      {encryptedFile && (
        <Button title="Download Encrypted File" onPress={handleDownload} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inputTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  inputTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedInputTypeButton: {
    backgroundColor: '#ccc',
  },
  inputTypeButtonText: {
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    width: '50%'
  },
});
