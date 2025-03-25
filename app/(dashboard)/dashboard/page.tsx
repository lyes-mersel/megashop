import getAuth from "@/lib/auth/getAuth";

const DashoardPage = async () => {
  const session = await getAuth();

  return (
    <main>
      <h1>Dashboard Page</h1>
      <p>ID : {session?.user.id}</p>
      <p>Email : {session?.user.email}</p>
      <p>Role : {session?.user.role}</p>
      <p>EmailVerifie : {session?.user.emailVerifie ? "true" : "false"}</p>
    </main>
  );
};

export default DashoardPage;
