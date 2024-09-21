"use client";

import { formatEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type BorrowerLoan = {
  args: {
    loanId?: bigint;
    amount?: bigint;
    repaymentAmount?: bigint;
  };
};

type BorrowedTableProps = {
  borrowerLoans?: BorrowerLoan[];
};

const BorrowedRow = ({ loan }: { loan: BorrowerLoan }) => {
  const { data: loanDetails, isLoading: isLoadingLoandDetails } = useScaffoldReadContract({
    contractName: "Lending",
    functionName: "getLoanDetails",
    args: [loan.args.loanId],
  });

  const { writeContractAsync: writeLending } = useScaffoldWriteContract("Lending");

  const handleRepay = async () => {
    try {
      await writeLending({
        functionName: "repayLoan",
        args: [loan.args.loanId],
        value: loan.args.repaymentAmount,
      });
    } catch (e) {
      console.log("There was error in handle repay");
    }
  };

  return (
    <tr>
      <td>{loan.args.loanId}</td>
      <td>{loan.args.amount ? formatEther(loan.args?.amount) : 0}</td>
      <td>{loan.args.repaymentAmount ? formatEther(loan.args?.repaymentAmount) : 0}</td>
      <td className="w-2/12 md:py-4">
        {loan.args.repaymentAmount && loan.args.amount
          ? (
              ((parseFloat(formatEther(loan.args.repaymentAmount)) - parseFloat(formatEther(loan.args.amount))) /
                parseFloat(formatEther(loan.args.amount))) *
              100
            ).toFixed(2)
          : 0}
      </td>
      <td>
        {isLoadingLoandDetails ? <span className="loading loading-sm"></span> : loanDetails?.isActive ? "Yes" : "No"}
      </td>
      <td>
        <button className="btn btn-sm btn-primary" disabled={!loanDetails?.isActive} onClick={handleRepay}>
          repay
        </button>
      </td>
    </tr>
  );
};

export const BrrowedTable = ({ borrowerLoans }: BorrowedTableProps) => {
  return (
    <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
      <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
        <thead>
          <tr className="rounded-xl text-sm text-base-content">
            <th className="bg-primary">Loan amount</th>
            <th className="bg-primary">Repayment amount</th>
            <th className="bg-primary">Repayment amount</th>
            <th className="bg-primary">Interes rate</th>
            <th className="bg-primary">Active</th>
            <th className="bg-primary">Repay</th>
          </tr>
        </thead>
        <tbody>
          {borrowerLoans?.map(loan => {
            return <BorrowedRow key={loan.args.loanId?.toString()} loan={loan} />;
          })}
        </tbody>
      </table>
    </div>
  );
};
