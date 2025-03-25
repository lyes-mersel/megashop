import getAuth from "@/lib/auth/getAuth";

const SettingsPage = async () => {
  const session = await getAuth();

  return (
    <main>
      <h1>Settings Page</h1>
      <p>ID : {session?.user.id}</p>
      <p>Email : {session?.user.email}</p>
      <p>Role : {session?.user.role}</p>
      <p>Image url : {session?.user.image || "null"}</p>
    </main>
  );
};

export default SettingsPage;
