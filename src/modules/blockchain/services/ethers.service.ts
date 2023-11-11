import { Injectable } from "@nestjs/common";
import Web3, { Block, ETH_DATA_FORMAT } from "web3";

@Injectable()
export class EthersService {
  private web3provider: Web3;
  constructor() {
    this.web3provider = new Web3(new Web3.providers.HttpProvider(process.env.ANKR_RPC));
  }

  async getBlocksByRange(start: number, end: number) {
    const batch = new this.web3provider.BatchRequest();
    for (let i = start; i <= end; i++) {
      batch.add({
        "jsonrpc":"2.0",
        "method":"eth_getBlockByNumber",
        "params":[this.web3provider.utils.toHex(i), true],
        "id": i
      });
    }
    const response = await batch.execute({ timeout: 6000 });
    return response.map(block => block.result as Block);
  }

  async getBlock(blockNumber: number) {
    return await this.web3provider.eth.getBlock(blockNumber, true);
  }

  async getLatestBlock() {
    return await this.web3provider.eth.getBlock("latest", false, ETH_DATA_FORMAT);
  }

  async getTransaction(hash: string) {
    return await this.web3provider.eth.getTransaction(hash);
  }

  async getTransactionCount(address: string) {
    return await this.web3provider.eth.getTransactionCount(address);
  }

  async getBalance(address: string) {
    return await this.web3provider.eth.getBalance(address);
  }
}