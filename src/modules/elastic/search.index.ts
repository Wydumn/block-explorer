import { OnModuleInit } from "@nestjs/common";
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { IndexName } from "./types";


export abstract class IndexService implements OnModuleInit {
  protected _indexName: string;
  constructor(
    protected esService: ElasticsearchService
  ) {}

  async onModuleInit() {
    try {
      const isExist = await this.esService.indices.exists({ index: this.indexName });
  
      if (!isExist) {
        this.createIndex();
      }
    } catch (err) {
      console.log("===== create index error ============", err)
    }
  }

  get indexName() {
    return this._indexName;
  }

  abstract createIndex(): Promise<void>;
}