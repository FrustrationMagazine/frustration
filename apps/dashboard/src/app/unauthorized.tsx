import Link from "next/link";

export default function Unauthorized() {
  return (
    <Link
      href="/auth/signin"
      className="m-auto bg-black p-2 px-4 text-3xl font-bold text-frustration-yellow"
    >
      Veuillez vous authentifier pour accéder à cette page
    </Link>
  );
}
