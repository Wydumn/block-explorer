import { CustomRepository } from "@/modules/database/decorators";
import { BlockEntity } from "../entities";
import { BaseRepository } from "@/modules/database/base";

@CustomRepository(BlockEntity)
export class BlockRepository extends BaseRepository<BlockEntity> {
  protected _qbName = 'block';
}