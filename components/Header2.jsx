import { router } from 'expo-router';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Card, IconButton } from 'react-native-paper';

const MyComponent = () => (
  <>
    <Card style={{margin:10}}>
    <TouchableOpacity onPress={() => router.push('/feats/dhancha')}>
    <Card.Title
      title="Dhancha"
      subtitle="Estimated Pricing"
      left={(props) => (
        <Avatar.Image
          {...props}
          source={require('../assets/images/rupaya.png')}
          size={50}
          style={styles.centeredAvatar} 
        />
      )}
      right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => router.push('feats/dhancha')} />}
    />
    </TouchableOpacity>
    </Card>
    <Card style={{margin:10}}>
    <TouchableOpacity onPress={() => router.push('feats/jagrook')}>
    <Card.Title
      title="Jagrook"
      subtitle="Educational Platform"
      left={(props) => (
        <Avatar.Image
          {...props}
          source={require('../assets/images/jagrook.png')}
          size={45}
          style={styles.centeredAvatar} 
        />
      )}
      right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => router.push('feats/jagrook')} />}
    />
    </TouchableOpacity>
    </Card>
    <Card style={{margin:10}}>
    <TouchableOpacity onPress={() => router.push('feats/medi-sight')}>
    <Card.Title
      title="Medi-Sight"
      subtitle="Medicinal Alternatives"
      left={(props) => (
        <Avatar.Image 
          {...props}
          source={require('../assets/images/medis.png')}
          size={50}
          style={styles.centeredAvatar} 
        />
      )}
      right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => router.push('feats/medi-sight')} />}
      />
      </TouchableOpacity>
      </Card>
    <Card style={{margin:10}}>
      <TouchableOpacity onPress={() => router.push('feats/dvit')}>
    <Card.Title
      title="Dvit"
      subtitle="Second Opinion Doctor"
      left={(props) => (
        <Avatar.Image
          {...props}
          source={require('../assets/images/second.png')}
          size={50}
          style={styles.centeredAvatar} 
        />
      )}
      right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => router.push('feats/dvit')} />}
    />
    </TouchableOpacity>
    </Card>
  </>
);

export default MyComponent;
const styles = StyleSheet.create({
  centeredAvatar: {
    backgroundColor: 'transparent', // Remove any background fill
    
  },
});
