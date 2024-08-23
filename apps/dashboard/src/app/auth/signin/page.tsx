// 🖼️ Assets
import { bebasNeue } from "@dashboard/fonts";
import { redirect } from "next/navigation";

// 🧱 Components
import SignInForm from "./components/SignInForm";

// 🔑 Auth
import { auth } from "@dashboard/auth";

export default async function SignIn() {
  const signedIn = !!(await auth())?.user;
  if (signedIn) redirect("/dashboard");

  const yellowOnBlack = `bg-black px-5 py-2 text-frustration-yellow ${bebasNeue.className} text-center text-3xl uppercase`;
  const Header = <header className={yellowOnBlack}>Authentification</header>;

  return (
    <div className={`m-auto w-[90%] max-w-[500px] shadow-lg`}>
      {Header}
      <SignInForm />
    </div>
  );
}
