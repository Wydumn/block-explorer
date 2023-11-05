import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { WriteResponseBase } from '@elastic/elasticsearch/lib/api/types';
import { BlockEntity } from "../entities";
import { instanceToPlain } from "class-transformer";


@Injectable()
export class SearchService {
  index = 'block';

  constructor(protected esService: ElasticsearchService) {}

  async search() {

  }

  async create(block: BlockEntity): Promise<WriteResponseBase> {
    return this.esService.index({
      index: this.index,
      document: instanceToPlain(block)
    });
  }

  async update() {}

  async delete() {}
}