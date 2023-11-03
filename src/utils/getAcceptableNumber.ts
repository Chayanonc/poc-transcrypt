import { ethers } from 'ethers';

export const calAcceptAmount = (
  amount: string,
  tokenDecimal: number,
  orderNumber: number,
) => {
  const amountUnit = ethers.parseUnits(amount);

  switch (tokenDecimal) {
    case 8:
      break;
    case 9:
      break;
    case 10:
      break;
    case 18:
      if (BigInt(orderNumber) <= BigInt(99999))
        return ethers.formatUnits(BigInt(amountUnit) + BigInt(orderNumber));
      return null;

    default:
      return null;
  }
};
