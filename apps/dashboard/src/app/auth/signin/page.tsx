import { redirect } from "next/navigation";
import { signedIn } from "../auth";
import { bebasNeue } from "@dashboard/fonts";
import Form from "./Form";

export default async function SignIn() {
  const isSignedIn = await signedIn();
  if (isSignedIn) redirect("/dashboard/income");

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
