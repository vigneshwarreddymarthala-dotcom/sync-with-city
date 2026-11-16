import { Suspense } from "react";
import DiscoverPg from "./disList";

const DiscoverList = () => {
  return (
    <Suspense>
      <DiscoverPg />
    </Suspense>
  );
};

export default DiscoverList;
