"use client";

import { useEffect, useState } from "react";
import { BrrowedTable } from "./_components/BorrowedTable";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { InputBase } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Borrow: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [loanAmount, setLoanAmount] = useState("0");
  const [repayAmount, setRepayAmount] = useState("0");
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const { writeContractAsync: writeLendingAsync } = useScaffoldWriteContract("Lending");

  const { data: borrowerLoans } = useScaffoldEventHistory({
    contractName: "Lending",
    eventName: "LoanRequested",
    filters: { borrower: connectedAddress },
    watch: true,
    fromBlock: 0n,
  });

  const handleBorrow = async () => {
    try {
      if (!loanAmount || !repayAmount) {
        notification.error("Please enter loan amount and repay amount");
        return;
      }

      await writeLendingAsync({
        functionName: "requestLoan",
        args: [parseEther(loanAmount), parseEther(repayAmount)],
      });
    } catch (e) {
      console.log("There was error in handle borrow");
    }
  };

  useEffect(() => {
    if (loanAmount && repayAmount) {
      const loanValue = parseFloat(loanAmount);
      const repayValue = parseFloat(repayAmount);
      if (loanValue > 0 && repayValue > loanValue) {
        const interest = repayValue - loanValue;
        const rate = (interest / loanValue) * 100;
        setInterestRate(rate);
      } else {
        setInterestRate(null);
      }
    } else {
      setInterestRate(null);
    }
  }, [loanAmount, repayAmount]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center flex-col pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Borrowing</span>
          </h1>
        </div>
      </div>
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col space-y-1">
            <p className="m-0">Enter loan amount</p>
            <InputBase placeholder="loan Amount" value={loanAmount} onChange={setLoanAmount} />
          </div>
          <div className="flex flex-col space-y-1">
            <p className="m-0">Enter repayment amount</p>
            <InputBase placeholder="loan Amount" value={repayAmount} onChange={setRepayAmount} />
          </div>
          {interestRate !== null && (
            <div className="mt-4 text-center">
              <p className="font-bold m-0">Annual Interest Rate:</p>
              <p className="text-xl text-primary m-0">{interestRate.toFixed(2)}%</p>
            </div>
          )}
          <button className="btn btn-primary btn-md" onClick={handleBorrow}>
            Borrow
          </button>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <h1 className="text-center text-2xl">Borrowed Loan</h1>
        <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
          {borrowerLoans && <BrrowedTable borrowerLoans={borrowerLoans} />}
        </div>
      </div>
    </div>
  );
};

export default Borrow;
