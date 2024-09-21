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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to Borrowing</h1>
        <p className="text-xl text-base-content/70">Request a loan or manage your existing loans</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Request a Loan</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Loan Amount</span>
              </label>
              <InputBase placeholder="Enter loan amount" value={loanAmount} onChange={setLoanAmount} />
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Repayment Amount</span>
              </label>
              <InputBase placeholder="Enter repayment amount" value={repayAmount} onChange={setRepayAmount} />
            </div>
            {interestRate !== null && (
              <div className="mt-4 text-center">
                <p className="font-bold">Annual Interest Rate:</p>
                <p className="text-2xl text-primary">{interestRate.toFixed(2)}%</p>
              </div>
            )}
            <div className="card-actions justify-end mt-6">
              <button className="btn btn-primary" onClick={handleBorrow}>
                Request Loan
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Your Loans</h2>
            {borrowerLoans && <BrrowedTable borrowerLoans={borrowerLoans} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Borrow;
