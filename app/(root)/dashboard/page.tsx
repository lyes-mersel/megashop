import getAuth from "@/lib/getAuth";
import { redirect } from "next/navigation";

const Dashoard = async () => {
  const session = await getAuth();
  if (!session) {
    redirect("/auth/login?redirect=/dashboard");
  }
  console.log("session : ", session);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>ID : {session?.user.id}</p>
      <p>Email : {session?.user.email}</p>
      <p>Role : {session?.user.role}</p>
    </div>
  );
};

export default Dashoard;
