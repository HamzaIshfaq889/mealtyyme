import React from 'react';

import {View} from 'react-native';

import Svg1 from '../../../assets/svgs/Vector11.svg';
import Svg2 from '../../../assets/svgs/Vector12.svg';
import Svg3 from '../../../assets/svgs/Vector13.svg';

const Slide3 = () => {
  return (
    <>
      <View className="absolute right-0 top-0">
        <Svg2 />
      </View>
      <View className="relative flex justify-center items-center">
        <Svg1 />
      </View>
      <View className="absolute left-0 right-0 -bottom-28">
        <Svg3 />
      </View>
    </>
  );
};

export default Slide3;
