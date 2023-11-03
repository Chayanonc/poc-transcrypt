import { ethers } from 'ethers';

export const getOrderIdFromAmount = (amount: string, tokenDecimal: number) => {
  const value = ethers.formatUnits(amount);
  switch (tokenDecimal) {
    case 8:
      break;
    case 9:
      break;
    case 10:
      break;
    case 18:
      const val = value.slice(-5);
      return Number(val);
    default:
      return null;
  }
};
