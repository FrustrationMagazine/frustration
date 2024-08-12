// 🧱 Components
import LastUpdate from "./_components/LastUpdate";
import FormUpdate from "./_components/FormUpdate";

// 🐝 Fetch
import { fetchLastUpdate } from "@dashboard/libs/stripe";

// 🧰 Server action configuration
export const maxDuration = 60;

export default async function UpdateForm() {
  const lastUpdate = await fetchLastUpdate();

  return (
    <div className='m-auto flex h-[270px] min-w-[500px] flex-col items-center justify-center gap-5 rounded-md bg-white px-12 py-6 shadow-md'>
      <LastUpdate lastUpdate={lastUpdate} />
      <FormUpdate />
    </div>
  );
}
