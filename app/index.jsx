import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView , useSafeAreaInsets } from "react-native-safe-area-context";

/* 
  COLOR SCHEMES
    LIGHT
      bg: rgb(68, 98, 74)
      primary-bg: rgb(192, 207, 178)
      secondary-bg: rgb(139, 168, 136)
*/

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const sampleData = [
    {
      id: 1,
      title: "Red round hat",
      category: "Hat",
      price: 750,
    },
    {
      id: 2,
      title: "Frieren jacket",
      category: "Jacket",
      price: 290,
    },
    {
      id: 3,
      title: "Nike pants",
      category: "Pants",
      price: 150,
    },
    {
      id: 4,
      title: "Red round hat",
      category: "Hat",
      price: 750,
    },
    {
      id: 5,
      title: "Frieren jacket",
      category: "Jacket",
      price: 290,
    },
    {
      id: 6,
      title: "Nike pants",
      category: "Pants",
      price: 150,
    },
    {
      id: 7,
      title: "Red round hat",
      category: "Hat",
      price: 750,
    },
    {
      id: 8,
      title: "Frieren jacket",
      category: "Jacket",
      price: 290,
    },
    {
      id: 9,
      title: "Nike pants",
      category: "Pants",
      price: 150,
    },
  ];

  const userProfile = [1, 4, 7];

  return (
    <View
      style={{
        backgroundColor: "rgb(68, 98, 74)",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ width: "100%" }}
      >
        <View style={{ backgroundColor: "blue", width: "100%", height: 400 }}>
          <Text style={{ color: "white" }}>This is the landing page.</Text>
        </View>
        <View
          style={{
            width: "100%",
            paddingHorizontal: 10,
            paddingVertical: 30,
            gap: 10,
          }}
        >
          <Text style={{ color: "white" }}>New Arrivals</Text>
          {sampleData.map((item) => (
            <Card key={item.id} item={item} cart={userProfile} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Card({ item = [], cart = [] }) {
  const [onCart, setCart] = useState(cart.includes(item.id) ? true : false);

  const cartSize = 23;

  function handleCartClick() {
    setCart(!onCart);
  }

  return (
    <View
      style={{
        backgroundColor: "rgb(192, 207, 178)",
        overflow: "hidden",
        elevation: 10,
        borderRadius: 10,
      }}
    >
      <Pressable
        android_ripple={{ color: "black" }}
        onPress={() => console.log("clicked id: ", item.id)}
      >
        {/* Image */}
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            height: 170,
          }}
        >
          <Image
            source="https://picsum.photos/seed/696/3000/2000"
            style={{
              backgroundColor: "red",
              width: "100%",
              height: "100%",
            }}
          />
        </View>

        {/* Text Wrapper */}
        <View
          style={{
            flex: 1,
            padding: 10,
            gap: 5,
          }}
        >
          <Text style={{ color: "green" }}>
            {item?.category ?? "No category!"}
          </Text>

          <Text>{item?.title ?? "No title!"}</Text>

          {/* Price and Cart */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "green" }}>
              P{item?.price ?? "No price!"}
            </Text>

            <Pressable onPress={() => handleCartClick()}>
              <View
                style={{
                  width: cartSize * 1.7,
                  height: cartSize * 1.7,
                  borderRadius: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                }}
              >
                <Ionicons
                  name={onCart ? "checkmark" : "cart-outline"}
                  size={cartSize}
                />
              </View>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
