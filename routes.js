const express = require('express');
const router = express.Router();
const User = require('../models/user');
const WalletTransaction = require('../models/wallet-transaction');
const GoldTransaction = require('../models/gold-transaction');


router.get('/portfolio/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
  
    const user = await User.findById(userId);
    const runningBalance = user.runningBalance;


    const walletTransactions = await WalletTransaction.find({ userId });

    let netFundAdded = 0;
    walletTransactions.forEach(transaction => {
      if (transaction.type === 'CREDIT') {
        netFundAdded += transaction.amount;
      } else if (transaction.type === 'DEBIT') {
        netFundAdded -= transaction.amount;
      }
    });

    const goldTransactions = await GoldTransaction.find({ userId });

  
    let netGoldQuantity = 0;
    goldTransactions.forEach(transaction => {
      if (transaction.type === 'CREDIT') {
        netGoldQuantity += transaction.quantity;
      } else if (transaction.type === 'DEBIT') {
        netGoldQuantity -= transaction.quantity;
      }
    });

    const goldPrice = runningBalance.goldPrice;
    const currentValue = netGoldQuantity * goldPrice;

 
    const initialFunds = runningBalance.wallet;
    const currentFund = initialFunds + netFundAdded;


    const initialBalance = initialFunds + currentValue;
    const netGrowthOrLoss = currentFund + currentValue - initialBalance;


    const gainOrLossPercentage = (netGrowthOrLoss / initialBalance) * 100;

   
    res.status(200).json({
      netFundAdded,
      currentFund,
      netGrowthOrLoss,
      gainOrLossPercentage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;