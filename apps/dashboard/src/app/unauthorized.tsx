import RedirectionMessage from "@components/RedirectionMessage";

export default function Unauthorized() {
  return (
    <RedirectionMessage href="/auth/signin">
      Veuillez vous authentifier pour accéder à cette page
    </RedirectionMessage>
  );
}
