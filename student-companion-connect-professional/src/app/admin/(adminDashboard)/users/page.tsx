import { Suspense } from "react";
import UserList from "./userList";

export default function UserPg() {
  return (
    <Suspense>
      <UserList />
    </Suspense>
  );
}
