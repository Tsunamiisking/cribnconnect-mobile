import { View, Text, StyleSheet, Image, TextInput} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Input from '@/components/ui/input'
import { useState } from 'react'
import BackHeader from '@/components/BackHeader'
import { Colors } from '@/constants/Colors'

const EditProfile = () => {
  const [item, setItem] = useState({
    ImageUri: require("../../../assets/images/displayimageCC.jpg"),
    fullName: 'John Doe',
    email: 'douglasallendev@gmail.com'
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Edit Profile" showUser={false} />
      <View style={styles.imageContainer}>
        <Image
          source={item.ImageUri}
          style={styles.image}
          resizeMode='cover'
        />
      </View>
      <View>
        <Input
          placeholder="Full Name"
          value={item.fullName}
          onChangeText={(text) => setItem({ ...item, fullName: text })}
        />
        <Input
          placeholder="Email"
          value={item.email}
          onChangeText={(text) => setItem({ ...item, email: text })}
        />
      </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: Colors.primary,
  },
})

export default EditProfile