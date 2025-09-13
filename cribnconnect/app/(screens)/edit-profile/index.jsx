import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/ui/input";
import { useState } from "react";
import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";

const EditProfile = () => {
  const [item, setItem] = useState({
    ImageUri: require("../../../assets/images/displayimageCC.jpg"),
    fullName: "John Doe",
    email: "douglasallendev@gmail.com",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Edit Profile" showUser={false} />
      <View style={styles.imageContainer}>
        <Image source={item.ImageUri} style={styles.image} resizeMode="cover" />
      </View>
      <View style={{ margin: 18 }}>
        <View>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            labelText="Full Name"
            placeholder="Full Name"
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
      </View>
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
    width: "100%",
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    fontSize: 16,
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
});

export default EditProfile;
