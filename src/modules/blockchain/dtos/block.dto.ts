import { IsArray, IsEthereumAddress, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsEthereumHash } from "../validators/IsEthHash";
import { IsStartsWith0x } from "../validators/IsSartsWith0x";
import { IsBigInt } from "class-validator-extended";

export class CreateBlockDto  {
  // 0x1b4
  @IsNumber()
  @IsNotEmpty()
  number!: number;

  // 0x + hash
  @IsEthereumHash({
    message: 'Invalid Ethereum Hash',
  })
  @IsString()
  @IsNotEmpty()
  hash!: string;

  @IsEthereumHash({
    message: 'Invalid Ethereum Hash',
  })
  @IsString()
  @IsNotEmpty()
  parentHash!: string;

  // 0x689056015818adbe
  @IsString()
  @IsStartsWith0x()
  @IsNotEmpty()
  nonce!: string;

  // 0x + account
  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  miner!: string;

  @IsBigInt()
  @IsNotEmpty()
  difficulty!: bigint;

  // 0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32
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

  @IsNumber()
  @IsNotEmpty()
  timestamp!: number;

  @IsBigInt()
  @IsNotEmpty()
  baseFeePerGas!: bigint;
  
  /* @IsArray()
  @IsEthereumHash({
    each: true,
  })
  transactions: string[]; */
}