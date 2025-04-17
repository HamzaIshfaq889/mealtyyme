// components/Calendar.js
import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import moment from "moment";
import DateComponent from "./DateComponent";

const Calendar = ({ onSelectDate, selected }: any) => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const tempDates = [];
    for (let i = 0; i < 10; i++) {
      tempDates.push(moment().add(i, "days"));
    }
    setDates(tempDates as any);
  }, []);

  return (
    <ScrollView
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
