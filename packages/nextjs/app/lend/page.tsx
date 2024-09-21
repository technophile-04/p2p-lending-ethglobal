"use client";

import { LendTable } from "./_components/LendTable";
import type { NextPage } from "next";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const Lend: NextPage = () => {
  const { data: borrowerLoans } = useScaffoldEventHistory({
    contractName: "Lending",
    eventName: "LoanRequested",
    watch: true,
    fromBlock: 0n,
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center flex-col pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Lending</span>
          </h1>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <h1 className="text-center text-2xl">Lend Loan</h1>
        <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
          {borrowerLoans && <LendTable borrowerLoans={borrowerLoans} />}
        </div>
      </div>
    </div>
  );
};

export default Lend;
