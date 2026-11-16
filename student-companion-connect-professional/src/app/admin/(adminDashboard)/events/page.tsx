import { Suspense } from "react";
import PostList from "./postList";

export default function PostPg() {
  return (
    <Suspense>
      <PostList />
    </Suspense>
  );
}
