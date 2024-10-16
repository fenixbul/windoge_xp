/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { Ledger } from 'icrc-token-ledger-tools'; // Ensure the Ledger class is correctly imported
import styled from 'styled-components';

function TokenTracker({ onClose, onMinimize }) {
  const [allTransactions, setAllTransactions] = useState([]); // Store all transactions
  const [loading, setLoading] = useState(true); // Loading state
  const [burnedTokens, setBurnedTokens] = useState(BigInt(0)); // Store total burned tokens
  const [topHolders, setTopHolders] = useState([]); // Store top holders
  const [transactionHistory, setTransactionHistory] = useState({}); // Store transactions by account
  const [expandedHolder, setExpandedHolder] = useState(null); // Track the expanded holder for dropdown

  // Ledger canister ID for the token ledger
  const canisterId = 'wqihv-qyaaa-aaaak-afjoa-cai';
  const ledger = new Ledger(canisterId);

  // Helper function to fetch and store all transactions
  const fetchTransactions = async () => {
    console.log(await ledger.collectHoldersAndBalances());
    const transactions = [];
    const accountTransactions = {}; // Store transactions by account

    try {
      // Using iterateTransactions to store all transactions
      await ledger.iterateTransactions((batch) => {
        batch.forEach((tx) => {
          transactions.push(tx); // Append each batch of transactions to the array

          // Associate transactions with specific accounts
          const involvedAccounts = [];
          if (tx.to?.account) involvedAccounts.push(tx.to.account);
          if (tx.from?.account) involvedAccounts.push(tx.from.account);

          involvedAccounts.forEach(account => {
            if (!accountTransactions[account]) {
              accountTransactions[account] = [];
            }
            accountTransactions[account].push(tx);
          });
        });
        return true; // Continue fetching transactions
      });
      
      setAllTransactions(transactions); // Set the fetched transactions in state
      setTransactionHistory(accountTransactions); // Set transactions grouped by account
      calculateBurnedTokens(transactions); // Calculate burned tokens
      calculateTopHolders(transactions); // Calculate top holders
    } catch (error) {
      console.error('Error fetching transactions: ', error);
    } finally {
      setLoading(false); // Stop the loading state once fetching is complete
    }
  };

  // Helper function to calculate total burned tokens
  const calculateBurnedTokens = (transactions) => {
    let totalBurned = BigInt(0);

    transactions.forEach((tx) => {
      if (tx.type === 'burn' && tx.value) {
        totalBurned += tx.value;
      }
    });

    setBurnedTokens(totalBurned);
  };

  // Helper function to calculate top holders based on the transactions
  const calculateTopHolders = (transactions, sortOrder = 'desc') => {
    const holders = {};

    transactions.forEach((tx) => {
      if (tx.type === 'mint' && tx.to?.account) {
        const account = tx.to.account;
        const principal = tx.to.principal || '';
        const subaccount = tx.to.subaccount || '';

        if (!holders[account]) {
          holders[account] = { account, principal, subaccount, balance: BigInt(0) };
        }
        holders[account].balance += tx.value;

      } else if (tx.type === 'burn' && tx.from?.account) {
        const account = tx.from.account;
        const principal = tx.from.principal || '';
        const subaccount = tx.from.subaccount || '';

        if (!holders[account]) {
          holders[account] = { account, principal, subaccount, balance: BigInt(0) };
        }
        holders[account].balance -= tx.value;

      } else if (tx.type === 'transfer') {
        if (tx.from?.account) {
          const fromAccount = tx.from.account;
          const fromPrincipal = tx.from.principal || '';
          const fromSubaccount = tx.from.subaccount || '';

          if (!holders[fromAccount]) {
            holders[fromAccount] = { account: fromAccount, principal: fromPrincipal, subaccount: fromSubaccount, balance: BigInt(0) };
          }

          holders[fromAccount].balance -= tx.value;
          if (tx.fee) holders[fromAccount].balance -= tx.fee; // Subtract fee if applicable
        }

        if (tx.to?.account) {
          const toAccount = tx.to.account;
          const toPrincipal = tx.to.principal || '';
          const toSubaccount = tx.to.subaccount || '';

          if (!holders[toAccount]) {
            holders[toAccount] = { account: toAccount, principal: toPrincipal, subaccount: toSubaccount, balance: BigInt(0) };
          }

          holders[toAccount].balance += tx.value;
        }
      }
    });

    const positiveBalances = Object.values(holders).filter(holder => holder.balance > BigInt(0));

    positiveBalances.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.balance < b.balance ? -1 : a.balance > b.balance ? 1 : 0;
      } else {
        return a.balance > b.balance ? -1 : a.balance < b.balance ? 1 : 0;
      }
    });

    const topHolders = positiveBalances.slice(0, 30);
    setTopHolders(topHolders);
  };

  const toggleTransactionDropdown = (account) => {
    setExpandedHolder(expandedHolder === account ? null : account);
  };

  const formatWithDecimals = (balance, decimals = 8) => {
    const divisor = BigInt(10) ** BigInt(decimals);
    const integerPart = balance / divisor;
    const fractionalPart = balance % divisor;
    const integerString = integerPart.toLocaleString();

    let fractionalString = fractionalPart.toString().padStart(Number(decimals), '0');
    fractionalString = fractionalString.replace(/0+$/, ''); // Remove trailing zeros
  
    return fractionalString ? `${integerString}.${fractionalString}` : integerString;
  };

  // Helper function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp / BigInt(1000000))); // Convert to milliseconds
    return date.toLocaleString();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <TrackerWrap>
      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <div>
          <h2>Total Transactions: {allTransactions.length}</h2>
          <h3>Total Burned Tokens: {formatWithDecimals(burnedTokens)}</h3>

          <h3>Top 30 Holders:</h3>
          <ul>
            {topHolders.map((holder, index) => (
              <li key={index}>
                <strong>Account:</strong> {holder.account}, 
                <strong> Principal:</strong> {holder.principal}, 
                <strong> Subaccount:</strong> {holder.subaccount || 'None'}, 
                <strong> Balance:</strong> {formatWithDecimals(holder.balance)}
                <button onClick={() => toggleTransactionDropdown(holder.account)}>
                  {expandedHolder === holder.account ? 'Hide Transactions' : 'Show Transactions'}
                </button>
                {expandedHolder === holder.account && (
                  <TransactionDropdown>
                    <ul>
                      {transactionHistory[holder.account]?.map((tx, txIndex) => (
                        <li key={txIndex}>
                          <strong>Type:</strong> {tx.type}, 
                          <strong> From:</strong> {tx.from?.account || 'Unknown'}, 
                          <strong> To:</strong> {tx.to?.account || 'Unknown'}, 
                          <strong> Value:</strong> {formatWithDecimals(tx.value)}, 
                          <strong> Timestamp:</strong> {formatTimestamp(tx.timestamp)}
                        </li>
                      )) || <p>No transactions available</p>}
                    </ul>
                  </TransactionDropdown>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </TrackerWrap>
  );
}

const TrackerWrap = styled.div`
  background: #fff;
  height: 100%;
`;

const TransactionDropdown = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  margin-top: 5px;
  background: #f9f9f9;
`;

export default TokenTracker;
