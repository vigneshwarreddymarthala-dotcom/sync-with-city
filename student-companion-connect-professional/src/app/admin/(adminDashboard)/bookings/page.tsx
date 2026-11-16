import { Suspense } from "react";
import Booking from "./booking";

export default function BookingPg() {
  return (
    <Suspense>
      <Booking />
    </Suspense>
  );
}
