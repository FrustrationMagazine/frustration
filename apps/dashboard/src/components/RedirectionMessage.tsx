import Link from "next/link";

type Props = Readonly<{
  href: string;
  children: React.ReactNode;
}>;

function RedirectionMessage({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="m-auto bg-black p-2 px-4 text-3xl font-bold text-frustration-yellow"
    >
      {children}
    </Link>
  );
}

export default RedirectionMessage;
