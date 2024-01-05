export const isWalletBalance = state => {
  return state.wallet.getWalletBalance;
};
export const isMiniBalance = state => {
  return state.wallet.getMinBalance;
};

export const isBalanceAdded = state => {
  return state.wallet.addBalance;
};

export const isHistoryUpdated = state => {
  return state.wallet.getHistory;
};

export const isEarning = state => {
  return state.wallet.getEarning;
};

export const isWalletSummary = state => {
  return state.wallet.getWalletSummary;
};
