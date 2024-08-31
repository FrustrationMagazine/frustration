import React from "react";
import SuperBallsLoader from "@/ui/loaders/loader-super-balls";

export default () => {
  return (
    <div className='flex h-full grow items-center justify-center'>
      <SuperBallsLoader />
    </div>
  );
};
