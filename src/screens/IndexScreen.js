import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import {NativeModules} from 'react-native';
const SharedStorage = NativeModules.SharedStorage;

var db = openDatabase({name: 'UserDatabase.db'});

const IndexScreen = ({navigation}) => {
  const [flatListItems, setFlatListItems] = useState(null);

  const loadUser = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; i++) {
          temp.push(results.rows.item(i));
        }
        setFlatListItems(temp);
        SharedStorage.set(JSON.stringify({text: flatListItems.length}));
      });
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUser();
    });
    return unsubscribe;
  }, [navigation]);

  const listViewItemSeperator = () => {
    return <View style={styles.listItemViewSeperator} />;
  };

  const listItemView = item => {
    return (
      <TouchableOpacity
        key={item.user_id.to_s}
        style={{padding: 5}}
        onPress={() => navigation.navigate('Read', {id: item.user_id})}>
        <View>
          <Text>ID Pengguna : #{item.user_id}</Text>
          <Text>Nama : {item.user_name}</Text>
          <Text>No HP :{item.user_contact}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.containerEmpty}>
          {flatListItems && flatListItems.length > 0 ? (
            <FlatList
              data={flatListItems}
              ItemSeparatorComponent={listViewItemSeperator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => listItemView(item)}
            />
          ) : (
            <View style={{flex: 1}}>
              <Image
                style={styles.emptyImage}
                source={require('../assets/empty.png')}
              />
              <Text style={styles.h4}>Belum ada pengguna</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
export default IndexScreen;

const styles = StyleSheet.create({
  listItemViewSeperator: {
    height: 0.2,
    width: '100%',
    backgroundColor: '#808080',
  },
  listItemView: {
    backgroundColor: 'white',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  emptyImage: {
    width: '80%',
    height: undefined,
    aspectRatio: 1 / 1,
  },
  containerEmpty: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  h4: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
