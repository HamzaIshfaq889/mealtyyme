import React from 'react';

import {View} from 'react-native';

import Svg1 from '@/assets/svgs/Vector5.svg';
import Svg2 from '@/assets/svgs/Vector6.svg';
import Svg3 from '@/assets/svgs/Vector7.svg';

const Slide1 = () => {
  return (
    <>
      <View className="absolute left-0 top-0">
        <Svg1 />
      </View>
      <View className="relative flex justify-center items-center mt-12">
        <Svg2 />
      </View>
      <View className="absolute left-0 right-0 -bottom-16">
        <Svg3 />
      </View>
    </>
  );
};

export default Slide1;
