import { Suspense } from "react";
import SearchProList from "../../proSearchList";
import ProSearch from "@/components/proSearch";
import StoreProTab from "@/components/storeProTab";

const StoreSearch = ({ params }: { params: { loc: string; cate: string } }) => {
  return (
    <Suspense>
      <StoreProTab />
      <ProSearch />
      <SearchProList loc={params.loc} cate={params.cate} />
    </Suspense>
  );
};

export default StoreSearch;
