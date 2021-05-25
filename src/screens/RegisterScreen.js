import React, {useState} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';

import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'UserDatabase.db'});

const RegisterScreen = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [userContact, setUserContact] = useState('');

  const registerUser = () => {
    if (!userName) {
      alert('Nama Wajib Diisi !');
      return;
    }
    if (!userContact) {
      alert('No HP Wajib Diisi !');
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_user (user_name, user_contact) VALUES (?,?)',
        [userName, userContact],
        (tx, results) => {
          console.log(results);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Tersimpan',
              'User berhasil Disimpan !',
              [
                {
                  text: 'OK',
                  onPress: () =>
                    navigation.replace('Read', {id: results.insertId}),
                },
              ],
              {cancelable: false},
            );
          } else alert('User tidak berhasil disimpan !');
        },
      );
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{flex: 1, justifyContent: 'space-between'}}>
              <TextInput
                placeholder="Nama"
                onChangeText={userName => setUserName(userName)}
                style={styles.textInput}
              />
              <TextInput
                placeholder="No HP"
                onChangeText={userContact => setUserContact(userContact)}
                maxLength={14}
                keyboardType="numeric"
                style={styles.textInput}
              />
              <Button title="Simpan" onPress={registerUser} />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    marginHorizontal: 5,
    flex: 1,
  },
  textInput: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    marginVertical: 10,
  },
});
