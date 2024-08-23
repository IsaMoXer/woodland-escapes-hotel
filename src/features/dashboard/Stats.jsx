import { HiOutlineBriefcase, HiOutlineChartBar } from "react-icons/hi";

import Stat from "./Stat";
import { HiOutlineBanknotes, HiOutlineCalendarDays } from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";

function Stats({ bookings, confirmedStays, numDays, cabinCount }) {
  // 1. Number of bookings
  const numBookings = bookings.length;

  // 2. Total sales
  const sales = bookings.reduce((acc, cur) => acc + cur.totalPrice, 0);

  // 3. Total stays
  const checkins = confirmedStays.length;

  // 4. Occupancy rate >> num checked in night / all available nights (num days * num cabins)
  const occupation = Math.round(
    (confirmedStays.reduce((acc, cur) => acc + cur.numNights, 0) /
      (numDays * cabinCount)) *
      100
  );

  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={checkins}
      />
      <Stat
        title="
        Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={occupation + "%"}
      />
    </>
  );
}

export default Stats;
