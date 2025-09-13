import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";

const EditProfile = () => {
  const [item, setItem] = useState({
    ImageUri: require("../../../assets/images/displayimageCC.jpg"),
    fullName: "John Doe",
    email: "douglasallendev@gmail.com",
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      country: "USA",
    },
  });

  const saveChanges = () => {
    // Logic to save changes goes here
    console.log("Changes saved:", item);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Edit Profile" showUser={false} />
      <View style={styles.imageContainer}>
        <Image source={item.ImageUri} style={styles.image} resizeMode="cover" />
      </View>
      <View style={{ margin: 18 }}>
        <View style={{ marginTop: 24 }}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            labelText="Full Name"
            // placeholder="Full Name"
            value={item.fullName}
            style={styles.input}
            onChangeText={(text) => setItem({ ...item, fullName: text })}
          />
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Email"
            value={item.email}
            style={styles.input}
            keyboardType="email-address"
            onChangeText={(text) => setItem({ ...item, email: text })}
          />
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            placeholderTextColor="#B0B0B0"
            value={item.address.street}
            onChangeText={(text) =>
              setItem({ ...item, address: { ...item.address, street: text } })
            }
          />
          <View className="flex-row">
            <TextInput
              style={styles.input}
              placeholder="State"
              placeholderTextColor="#B0B0B0"
              value={item.address.state}
              onChangeText={(text) =>
                setItem({ ...item, address: { ...item.address, state: text } })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#B0B0B0"
              value={item.address.city}
              onChangeText={(text) =>
                setItem({ ...item, address: { ...item.address, city: text } })
              }
            />
          </View>
          <View className="flex-row">
            <TextInput
              style={styles.input}
              placeholder="Zip Code"
              placeholderTextColor="#B0B0B0"
              value={item.address.zip}
              onChangeText={(text) =>
                setItem({ ...item, address: { ...item.address, zip: text } })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Country"
              placeholderTextColor="#B0B0B0"
              value={item.address.country}
              onChangeText={(text) =>
                setItem({
                  ...item,
                  address: { ...item.address, country: text },
                })
              }
            />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={saveChanges}>
        <Text
          style={{ color: "white", fontFamily: "Sora-SemiBold", fontSize: 16 }}
        >
          Save Changes
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: Colors.primary,
  },
  input: {
    // width: "100%",
    // flex: 1,
    // height: Platform.OS === "ios" ? 50 : 60,
    // borderWidth: 1,
    // borderColor: Colors.borderColor,
    // borderRadius: 12,
    // fontSize: 16,
    // color: Colors.primary,
    // fontFamily: "Sora-Regular",
    // marginTop: 12,
    // paddingHorizontal: 16,

    width: "100%",
    flex: 1,
    height: Platform.OS === "ios" ? 50 : 60,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    // marginBottom: 12,
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "Sora-Regular",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  label: {
    color: "#111827",
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "Sora-SemiBold",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 18,
  },
});

export default EditProfile;
