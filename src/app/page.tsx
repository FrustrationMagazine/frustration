import { get } from "http";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(options);
  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
