import React, {useState, useEffect} from 'react';
import {Text, View, SafeAreaView, StyleSheet, Button} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'UserDatabase.db'});

const ReadScreen = ({route, navigation}) => {
  const inputUserId = route.params.id;

  const [userData, setUserData] = useState({});

  const viewUser = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM table_user where user_id = ?',
        [inputUserId],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            setUserData(results.rows.item(0));
          } else {
            alert('User Tidak Ditemukan !');
          }
        },
      );
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      viewUser();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <View style={styles.viewChild}>
            <Text>ID: #{userData.user_id}</Text>
            <Text>Nama: {userData.user_name}</Text>
            <Text>No HP: {userData.user_contact}</Text>
          </View>
        </View>
        <Button
          title="Ubah"
          onPress={() => navigation.navigate('Update', {id: route.params.id})}
        />
      </View>
    </SafeAreaView>
  );
};

export default ReadScreen;

const styles = StyleSheet.create({
  viewChild: {
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
