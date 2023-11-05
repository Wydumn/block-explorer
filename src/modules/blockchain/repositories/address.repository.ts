import { CustomRepository } from "@/modules/database/decorators";
import { AddressEntity } from "../entities";
import { BaseRepository } from "@/modules/database/base";

@CustomRepository(AddressEntity)
export class AddressRepository extends BaseRepository<AddressEntity> {
  protected _qbName = 'address';
}