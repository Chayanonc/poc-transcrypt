export const formatEIP681 = {
  ethPayment: (receiverAddress: string, amount: string, chainId?: number) => {
    // amount should be wei
    return `ethereum:${receiverAddress}${
      chainId ? '@' + chainId : ''
    }?value=${amount}`;
  },
  erc20Transfer: (
    contractAddress: string,
    receiverAddress: string,
    amount: string,
    chainId?: number,
  ) => {
    return `ethereum:${contractAddress}${
      chainId ? '@' + chainId : ''
    }/transfer?address=${receiverAddress}&uint256=${amount}`;
  },
};
