// components/Calendar.js
import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import moment from "moment";
import DateComponent from "./DateComponent";

const Calendar = ({ onSelectDate, selected }: any) => {
  const [dates, setDates] = useState<moment.Moment[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const tempDates: moment.Moment[] = [];

    const startDate = moment().subtract(7, "days");
    const endDate = moment().add(21, "days");

    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate, "day")) {
      tempDates.push(currentDate.clone());
      currentDate.add(1, "day");
    }

    setDates(tempDates);

    // Now scroll immediately after setting
    setTimeout(() => {
      if (scrollViewRef.current) {
        const todayIndex = 7; // Since 1 week before today
        const itemWidth = 70; // Adjust if your DateComponent is different
        const screenWidth = Dimensions.get("window").width;
        const targetOffset =
          itemWidth * todayIndex - screenWidth / 2 + itemWidth / 2;

        scrollViewRef.current.scrollTo({ x: targetOffset, animated: false });
      }
    }, 0); // Delay slightly to ensure ScrollView has rendered
  }, []);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {dates.map((date, index) => (
        <DateComponent
          key={index}
          date={date}
          onSelectDate={onSelectDate}
          selected={selected}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
  },
});

export default Calendar;
