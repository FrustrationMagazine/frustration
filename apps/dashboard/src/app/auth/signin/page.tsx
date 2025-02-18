import { redirect } from "next/navigation";
import { signedIn } from "../auth";
import Form from "./Form";

export default async function SignIn() {
  const isSignedIn = await signedIn();
  if (isSignedIn) redirect("/dashboard/income");

  return (
    <div className="m-auto w-[90%] max-w-[500px] shadow-lg">
      <header className="text-yellow bg-black px-5 py-2 text-center font-bebas text-3xl uppercase">
        Authentification
      </header>
      <Form />
    </div>
  );
}
