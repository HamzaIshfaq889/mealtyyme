import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { router } from "expo-router";

import { Text, View } from "react-native";
import Swiper from "react-native-swiper";

import { Button, ButtonText } from "@/components/ui/button";

import Slide1 from "./slide1";
import Slide2 from "./slide2";
import Slide3 from "./slide3";

const OnBoarding = () => {
  const dispatch = useDispatch();
  const swiperRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = async () => {
    setCurrentSlide(currentSlide + 1);

    if (currentSlide < 2) {
      if (swiperRef.current) {
        swiperRef.current.scrollBy(1);
      }
    } else {
      router.replace("/(protected)/(onboarding)/pick-diet");
    }
  };

  const slideContent = [
    {
      title: "Discover 1000+ delicious recipes",
      description:
        "Unlock access to a huge collection of recipes—over 100,000 and counting!.",
    },
    {
      title: "Order groceries straight to your door",
      description: "Skip the store—your groceries come to you!",
    },
    {
      title: "Save time. Eat better. Enjoy life.",
      description: "Seamlessly organize meals to enjoy more time with family!",
    },
  ];

  return (
    <View className="flex bg-background flex-col">
      <View className="flex w-full h-[70%]">
        <Swiper
          ref={swiperRef}
          showsPagination={true}
          paginationStyle={{
            bottom: 10,
          }}
          dotStyle={{
            width: 8,
            height: 8,
            borderRadius: 5,
            margin: 4,
          }}
          activeDotStyle={{
            backgroundColor: "#000",
            width: 8,
            height: 8,
            borderRadius: 6,
            margin: 4,
            borderWidth: 1,
          }}
          onIndexChanged={(index) => setCurrentSlide(index)}
          loop={false}
        >
          <Slide1 />
          <Slide2 />
          <Slide3 />
        </Swiper>
      </View>
      <View className="mt-auto px-4 h-[30%]">
        <Text className="text-center text-primary font-bold text-3xl mb-3 leading-9 font-sofia">
          {slideContent[currentSlide]?.title}
        </Text>
        <Text className="text-center text-xl leading-8 text-muted mb-10">
          {slideContent[currentSlide]?.description}
        </Text>
        <Button onPress={handleNext}>
          <ButtonText>{currentSlide === 2 ? "Get Started" : "Next"}</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default OnBoarding;
