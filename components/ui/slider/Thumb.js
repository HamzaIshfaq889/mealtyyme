import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

const THUMB_RADIUS_LOW = 12;
const THUMB_RADIUS_HIGH = 16;

const Thumb = ({ name }) => {
    return <View style={name === 'high' ? styles.rootHigh : styles.rootLow} />;
};

const styles = StyleSheet.create({
    rootLow: {
        width: THUMB_RADIUS_LOW * 2,
        height: THUMB_RADIUS_LOW * 2,
        borderRadius: THUMB_RADIUS_LOW,
        borderWidth: 3,
        borderColor: '#fff',
        backgroundColor: '#030319',
    },
    rootHigh: {
        width: THUMB_RADIUS_HIGH * 2,
        height: THUMB_RADIUS_HIGH * 2,
        borderRadius: THUMB_RADIUS_HIGH,
        borderWidth: 3,
        borderColor: '#fff',
        backgroundColor: '#030319',
    },
});

export default memo(Thumb);