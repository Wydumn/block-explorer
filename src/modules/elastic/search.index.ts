import { OnModuleInit } from "@nestjs/common";
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { AppLoggerService } from "../logger/logger.service";


export abstract class IndexService implements OnModuleInit {
  protected _indexName: string;
  constructor(
    protected esService: ElasticsearchService,
    protected logger: AppLoggerService,
  ) {}

  async onModuleInit() {
    try {
      const isExist = await this.esService.indices.exists({ index: this.indexName });
  
      if (!isExist) {
        this.createIndex();
      }
    } catch (err) {
      this.logger.error(`[FAILED INDEX]: ${this.indexName} index create failed, ${err}`);
    }
  }

  get indexName() {
    return this._indexName;
  }

  abstract createIndex(): Promise<void>;
}