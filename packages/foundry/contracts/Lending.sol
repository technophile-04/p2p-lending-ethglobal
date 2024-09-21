//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lending {
    struct Loan {
        address borrower;
        address lender;
        uint256 amount;
        uint256 repaymentAmount;
        bool isActive;
        bool isRepaid;
    }

    mapping(uint256 => Loan) public loans;
    uint256 public loanCount;

    event LoanRequested(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 repaymentAmount
    );
    event LoanFunded(uint256 indexed loanId, address lender);
    event LoanRepaid(uint256 indexed loanId);

    function requestLoan(uint256 _amount, uint256 _repaymentAmount) external {
        require(_amount > 0, "Loan amount must be greater than 0");
        require(
            _repaymentAmount > _amount,
            "Repayment amount must be greater than loan amount"
        );

        uint256 loanId = loanCount;

        loans[loanId] = Loan({
            borrower: msg.sender,
            lender: address(0),
            amount: _amount,
            repaymentAmount: _repaymentAmount,
            isActive: false,
            isRepaid: false
        });

        emit LoanRequested(loanId, msg.sender, _amount, _repaymentAmount);
        loanCount++;
    }

    function fundLoan(uint256 _loanId) external payable {
        Loan storage loan = loans[_loanId];
        require(!loan.isActive, "Loan is already funded");
        require(loan.amount == msg.value, "Incorrect funding amount");

        loan.lender = msg.sender;
        loan.isActive = true;

        (bool sent, ) = payable(loan.borrower).call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        emit LoanFunded(_loanId, msg.sender);
    }

    function repayLoan(uint256 _loanId) external payable {
        Loan storage loan = loans[_loanId];
        require(loan.isActive, "Loan is not active");
        require(!loan.isRepaid, "Loan is already repaid");
        require(msg.sender == loan.borrower, "Only borrower can repay");
        require(
            msg.value == loan.repaymentAmount,
            "Incorrect repayment amount"
        );

        loan.isRepaid = true;
        loan.isActive = false;

        (bool sent, ) = payable(loan.lender).call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        emit LoanRepaid(_loanId);
    }

    function getLoanDetails(
        uint256 _loanId
    ) external view returns (Loan memory) {
        return loans[_loanId];
    }
}
