import { Suspense } from "react";
import ClubSearchPg from "./searchList";

const MyFriends = () => {
  return (
    <Suspense>
      <ClubSearchPg />
    </Suspense>
  );
};

export default MyFriends;
