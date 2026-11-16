import { Suspense } from "react";
import CreatorList from "./creatorList";

export default function AdmCreators() {
  return (
    <Suspense>
      <CreatorList />
    </Suspense>
  );
}
