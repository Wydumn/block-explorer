import { IsArray, IsEthereumAddress, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsEthereumHash } from "../validators/IsEthHash";
import { IsStartsWith0x } from "../validators/IsSartsWith0x";
import { IsBigInt } from "class-validator-extended";

export class CreateBlockDto  {
  @IsBigInt()
  @IsNotEmpty()
  baseFeePerGas!: bigint;

  @IsBigInt()
  @IsNotEmpty()
  difficulty!: bigint;

  @IsString()
  @IsStartsWith0x()
  @IsNotEmpty()
  extraData!: string;

  @IsBigInt()
  @IsNotEmpty()
  gasLimit!: bigint;

  @IsBigInt()
  @IsNotEmpty()
  gasUsed!: bigint;

  @IsEthereumHash({
    message: 'Invalid Ethereum Hash',
  })
  @IsString()
  @IsNotEmpty()
  hash!: string;

  @IsString()
  logsBloom: string;

  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  miner!: string;

  @IsBigInt()
  @IsNotEmpty()
  nonce!: bigint;

  @IsBigInt()
  @IsNotEmpty()
  number!: bigint;

  @IsEthereumHash({
    message: 'Invalid Ethereum Hash',
  })
  @IsString()
  @IsNotEmpty()
  parentHash!: string;

  @IsEthereumHash({
    message: 'Invalid Ethereum Hash',
  })
  @IsString()
  receiptsRoot: string;


  @IsBigInt()
  @IsNotEmpty()
  timestamp!: number;
  
  @IsArray()
  @IsEthereumHash({
    each: true,
  })
  transactions: string[];
}