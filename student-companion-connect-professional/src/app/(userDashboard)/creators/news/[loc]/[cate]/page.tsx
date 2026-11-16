import { Suspense } from "react";
import SearchNews from "../../searchNews";

const SearchNewList = ({
  params,
}: {
  params: { loc: string; cate: string };
}) => {
  return (
    <Suspense>
      <SearchNews loc={params.loc} cate={params.cate} />
    </Suspense>
  );
};

export default SearchNewList;
