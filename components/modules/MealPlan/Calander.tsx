import React, { useState, useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Dimensions } from "react-native";
import moment from "moment";
import DateComponent from "./DateComponent";
import { useSelector } from "react-redux";
import { checkisProUser } from "@/utils";

const Calendar = ({ onSelectDate, selected }: any) => {
  const status = useSelector(
    (state: any) =>
      state.auth.loginResponseType.customer_details?.subscription?.status
  );
  const isProUser = checkisProUser(status);

  const daysTOShow = isProUser ? 6 : 3;

  const [dates, setDates] = useState<moment.Moment[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const tempDates: moment.Moment[] = [];

    const startDate = moment().subtract(3, "days");
    const endDate = moment().add(daysTOShow, "days");

    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate, "day")) {
      tempDates.push(currentDate.clone());
      currentDate.add(1, "day");
    }

    setDates(tempDates);

    // Default select today
    const today = moment().format("YYYY-MM-DD");
    onSelectDate(today);

    // Scroll to today
    setTimeout(() => {
      if (scrollViewRef.current) {
        const todayIndex = 3; // index in the tempDates array (3 days before today)
        const itemWidth = 70;
        const screenWidth = Dimensions.get("window").width;
        const targetOffset =
          itemWidth * todayIndex - screenWidth / 2 + itemWidth / 2;

        scrollViewRef.current.scrollTo({ x: targetOffset, animated: false });
      }
    }, 0);
  }, []);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      className="bg-background "
    >
      {dates.map((date, index) => {
        const isBeforeToday = date.isBefore(moment(), "day");
        return (
          <DateComponent
            key={index}
            date={date}
            onSelectDate={onSelectDate}
            selected={selected}
            disabled={false}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
  },
});

export default Calendar;
