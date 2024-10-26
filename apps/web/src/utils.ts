export const generateResponseError = ({
  errorMessage,
}: {
  errorMessage: string;
}) => {
  return new Response(
    JSON.stringify({
      error: errorMessage,
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
