import React from "react";
import { Button } from "@/ui/components/button";
import { updateDashboard } from "./_actions/updateDashboard";
import { getLastDashboardUpdatedDate } from "@/stripe";

const Update = async () => {
  const lastDashboardUpdatedDate = await getLastDashboardUpdatedDate();
  console.log("lastDashboardUpdatedDate", lastDashboardUpdatedDate);

  return (
    <>
      {lastDashboardUpdatedDate ? (
        <p>
          Date de dernière mise à jour :{" "}
          <span className='capitalize'>{lastDashboardUpdatedDate}</span>
        </p>
      ) : null}
      <form action={updateDashboard}>
        <Button className='font-bold' variant='default' type='submit'>
          Mettre à jour le dashboard
        </Button>
      </form>
    </>
  );
};

export default Update;
