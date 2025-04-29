import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import { useTheme } from "react-native-paper";

import MyCarousel from "../components/MyCarousel";
import Card from "../components/Card";

/* 
  COLOR SCHEMES
    LIGHT
      bg: rgb(68, 98, 74)
      primary-bg: rgb(192, 207, 178)
      secondary-bg: rgb(139, 168, 136)
*/

export default function Index() {
  const theme = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);

  const carouselData = [
    {
      id: 1,
      image: "https://picsum.photos/seed/1/3000/2000",
    },
    {
      id: 2,
      image: "https://picsum.photos/seed/2/3000/2000",
    },
    {
      id: 3,
      image: "https://picsum.photos/seed/3/3000/2000",
    },
    {
      id: 4,
      image: "https://picsum.photos/seed/4/3000/2000",
    },
    {
      id: 5,
      image: "https://picsum.photos/seed/5/3000/2000",
    },
  ];

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
        backgroundColor: theme.background.primary ,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        paddingTop: 5,
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ width: "100%" }}
      >
        {/* Carousel */}
        <MyCarousel carouselData={carouselData} />
        <View
          style={{
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

<Card />;
