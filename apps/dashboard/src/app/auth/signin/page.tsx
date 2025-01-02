import { redirect } from "next/navigation";

// 🖋️ Fonts
import { bebasNeue } from "@dashboard/fonts";

// 🧱 Components
import Form from "./Form";

// 🔑 Auth
import { signedIn } from "@dashboard/auth";

export default async function SignIn() {
  // 🔀 Redirect to dashboard if signed in
  if (await signedIn()) redirect("/dashboard");

  return (
    <div className={`m-auto w-[90%] max-w-[500px] shadow-lg`}>
      <header
        className={`bg-black px-5 py-2 text-frustration-yellow ${bebasNeue.className} text-center text-3xl uppercase`}
      >
        Authentification
      </header>
      <Form />
    </div>
  );
}
