import UpdateForm from "./_components/UpdateForm";
import LastUpdate from "./_components/LastUpdate";
const Update = async () => {
  /******************/
  /*     RENDER     */
  /******************/

  return (
    <div className='m-auto flex min-w-[500px] flex-col items-center gap-5 rounded-md bg-white px-12 py-6 shadow-md'>
      <LastUpdate />
      <UpdateForm />
    </div>
  );
};

export default Update;
