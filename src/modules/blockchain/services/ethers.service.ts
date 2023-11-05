import { Injectable } from "@nestjs/common";
import { JsonRpcProvider } from "ethers";

@Injectable()
export class EthersService {
  private provider: JsonRpcProvider
  constructor() {
    // testnet https://g.w.lavanet.xyz:443/gateway/gth1/rpc-http/89056908ddb144ad3723628dd9a6f12b
    // mainnet https://g.w.lavanet.xyz:443/gateway/eth/rpc-http/89056908ddb144ad3723628dd9a6f12b
    // Holesky https://rpc.ankr.com/eth_holesky/225e8814d3678f7166e498bfc249501143f50af64d3a305b83c65a7139826131
    this.provider = new JsonRpcProvider('https://rpc.ankr.com/eth_holesky/225e8814d3678f7166e498bfc249501143f50af64d3a305b83c65a7139826131');
  }

  async getBlock(blockNumber: number) {
    return await this.provider.getBlock(blockNumber);
  }

  async getLatestBlock() {
    return await this.provider.getBlock("latest");
  }

  async getTransaction(hash: string) {
    return await this.provider.getTransaction(hash);
  }

  async getTransactionCount(address: string) {
    return await this.provider.getTransactionCount(address);
  }

  async getBalance(address: string) {
    return await this.provider.getBalance(address);
  }
}