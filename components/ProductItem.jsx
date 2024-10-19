import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const ProductItem = ({ item }) => {
  return (
    <Pressable style={{ marginHorizontal: 20, marginVertical: 20 }}>
      <Image
        style={{ width: 140, height: 150, resizeMode: "contain" }}
        source={{ uri: item?.image }}
      />
      <Text numberOfLines={1} style={{ width: 140, marginTop: 10 }}>
        {item?.title}
      </Text>

      <View style={{ marginTop: 5, flexDirection: "row" }}>
        <Text>{item?.price}</Text>
        <Text style={{ color: "#FFC72c", fontWeight: "bold" }}>
          {item?.rating?.rate} ratings
        </Text>
      </View>
      <Pressable
        style={{ backgroundColor: "#FFC72C",
             padding: 10,
             borderRadius: 20,
            justifyContent:"center",
            alignItems:"center",
            marginHorizontal:10,
            marginTop:10,
            }}
      >
        <Text>Add to Cart</Text>
      </Pressable>
    </Pressable>
  );
};

export default ProductItem;

const styles = StyleSheet.create({});
