import React, {useState, useEffect} from 'react';
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

const UpdateScreen = ({route, navigation}) => {
  const inputUserId = route.params.id;
  const [userName, setUserName] = useState('');
  const [userContact, setUserContact] = useState('');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM table_user where user_id = ?',
        [inputUserId],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            let res = results.rows.item(0);
            setUserName(res.user_name);
            setUserContact(res.user_contact);
          } else {
            alert('User Tidak Ditemukan !');
          }
        },
      );
    });
  }, []);

  const updateUser = () => {
    if (!userName) {
      alert('Nama Wajib Diisi !');
      return;
    }
    if (!userContact) {
      alert('Nama Wajib Diisi !');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'UPDATE table_user set user_name=?, user_contact=?  where user_id=?',
        [userName, userContact, inputUserId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Berhasil',
              'User berhasil diupdate !',
              [
                {
                  text: 'OK',
                  onPress: () =>
                    navigation.navigate('Read', {
                      id: route.params.id,
                    }),
                },
              ],
              {cancelable: false},
            );
          } else alert('User tidak berhasil diupdate !');
        },
      );
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1}}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{flex: 1, justifyContent: 'space-between'}}>
              <TextInput
                placeholder="Nama"
                value={userName}
                onChangeText={userName => setUserName(userName)}
                style={styles.textInput}
              />
              <TextInput
                placeholder="No HP"
                value={userContact.toString()}
                onChangeText={userContact => setUserContact(userContact)}
                maxLength={14}
                keyboardType="numeric"
                style={styles.textInput}
              />
              <Button title="Simpan" onPress={updateUser} />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UpdateScreen;
const styles = StyleSheet.create({
  textInput: {
    padding: 10,
  },
});
