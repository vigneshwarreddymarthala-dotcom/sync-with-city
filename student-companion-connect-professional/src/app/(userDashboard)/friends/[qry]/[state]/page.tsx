import { Suspense } from "react";
import FrdSearchPg from "../searchList";

const SearchList = ({
  params,
}: {
  params: { qry: string; state: string; lang: string };
}) => {
  return (
    <Suspense>
      <FrdSearchPg qry={params.qry} state={params.state} lang={params.lang} />
    </Suspense>
  );
};

export default SearchList;
