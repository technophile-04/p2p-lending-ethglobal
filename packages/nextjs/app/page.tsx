"use client";

import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 flex items-start justify-center py-24 px-4">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            P2P Lending
          </h1>
          <p className="text-xl mb-8">Empower Your Financial Future</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-8">
            <Link href="/borrow" className="btn btn-primary btn-lg flex-1">
              Borrow Funds
            </Link>
            <Link href="/lend" className="btn btn-secondary btn-lg flex-1">
              Lend Assets
            </Link>
          </div>
          <div className="divider">Our Platform</div>
          <ul className="steps steps-vertical sm:steps-horizontal w-full">
            <li className="step step-primary">Connect Wallet</li>
            <li className="step step-primary">Choose Action</li>
            <li className="step">Set Terms</li>
            <li className="step">Complete Transaction</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
