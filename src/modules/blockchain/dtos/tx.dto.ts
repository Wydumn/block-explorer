import { IsEthereumAddress, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IsEthereumHash } from "../validators/IsEthHash";
import { IsBigInt } from "class-validator-extended";
import { Transform } from "class-transformer";


export class CreateTxDto {
  // @IsOptional()
  @IsEthereumHash()
  @IsString()
  blockHash!: string;

  /* @IsNumber()
  @IsNotEmpty()
  index!: number; */

  // null when pending, but our request is all in block,which is confirmed
  @IsNumber()
  blockNumber!: number;
  
  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  from!: string;

  @IsBigInt()
  @IsNotEmpty()
  gasLimit!: bigint;
  
  @IsBigInt()
  @IsNotEmpty()
  gasPrice!: bigint;

  @IsEthereumHash()
  @IsString()
  @IsNotEmpty()
  hash!: string;

  @IsBigInt()
  @IsOptional()
  maxPriorityFeePerGas!: bigint;

  @IsBigInt()
  @IsOptional()
  maxFeePerGas!: bigint;

  @IsNumber()
  @IsNotEmpty()
  nonce!: number;

  @IsEthereumAddress()
  @IsString()
  @IsOptional()
  to!: string;

  @IsString()
  @IsNotEmpty()
  data!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toString())
  value!: string;
}