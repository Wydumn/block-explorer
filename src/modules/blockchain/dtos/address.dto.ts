import { PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDefined, IsEthereumAddress, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAddressDto {
  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toString())
  balance: string;
  
  @IsNumber()
  @IsNotEmpty()
  nonce: number;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @IsString()
  @IsDefined()
  id: string;
}