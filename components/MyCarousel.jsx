import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { Pagination } from "react-native-reanimated-carousel";

const width = Dimensions.get("window").width;

function MyCarousel({ carouselData }) {
  const ref = useRef(null);
  const progress = useSharedValue(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);

  const onPressPagination = (index) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const handleUserInteraction = () => {
    setAutoPlayEnabled(false);
    setTimeout(() => setAutoPlayEnabled(true), 1500);
  };

  const onButtonPress = (direction) => {
    handleUserInteraction();
    const currentIndex = Math.round(progress.value);
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % carouselData.length
        : (currentIndex - 1 + carouselData.length) % carouselData.length;

    ref.current?.scrollTo({
      count: newIndex - currentIndex,
      animated: true,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        ref={ref}
        width={width}
        height={width / 1.5}
        data={carouselData}
        onProgressChange={progress}
        loop
        autoPlay={autoPlayEnabled}
        autoPlayInterval={1500}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
        )}
      />

      {/* Pagination */}
      <Pagination.Basic
        progress={progress}
        data={carouselData}
        dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
        containerStyle={{ gap: 5, marginTop: 10 }}
        onPress={onPressPagination}
      />

      {/* Button Controls */}
      <View
        style={{
          position: "absolute",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          top: "50%",
          transform: "translateY(-30%)",
        }}
      >
        <TouchableOpacity
          onPress={() => onButtonPress("back")}
          style={{
            backgroundColor: "rgba(0, 0, 0, .4)",
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
          }}
        >
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onButtonPress("next")}
          style={{
            backgroundColor: "rgba(0, 0, 0, .4)",
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
          }}
        >
          <Ionicons name="chevron-forward" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default MyCarousel;
