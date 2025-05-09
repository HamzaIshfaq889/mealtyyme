import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { router } from "expo-router";

import { View } from "react-native";
import Swiper from "react-native-swiper";

import { Button, ButtonText } from "@/components/ui/button";

import Slide1 from "./slide1";
import Slide2 from "./slide2";
import Slide3 from "./slide3";
import { setOnboardingComplete } from "@/redux/slices/Auth";
import { setOnboardingComplete as setOnboardingCompleteStorage } from "@/utils/storage/authStorage";

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
      dispatch(setOnboardingComplete(true));
      await setOnboardingCompleteStorage();

      router.replace("/(auth)/account-options");
    }
  };

  return (
    <View className="flex flex-col">
      <View className="flex w-full h-[90%]">
        <Swiper
          ref={swiperRef}
          showsPagination={true}
          paginationStyle={{
            bottom: 230,
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
      <View className="px-10 mt-auto">
        <Button onPress={handleNext}>
          <ButtonText>{currentSlide === 2 ? "Get Started" : "Next"}</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default OnBoarding;
