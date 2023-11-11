import { Controller, Get, Param, Query } from "@nestjs/common";
import { BlockService } from "../services/block.service";
import { PaginateOptions } from "@/modules/database/types";

@Controller('block')
export class BlockController {
  constructor(
    private blockService: BlockService,
  ) {}

  @Get()
  async getBlocks(@Query() options: PaginateOptions) {
    // return await this.blockService.paginate(options);
  }

  @Get(':identifier')
  async getBlockByNumberOrHash(
    @Param('identifier') identifier: string
  ) {
    if (identifier.startsWith('0x')) {
      const hash = identifier;
      return await this.blockService.getBlockByHash(hash);
    }
  
    const blockNumber = parseInt(identifier);
    return await this.blockService.getBlockByNumber(blockNumber);
  }
}