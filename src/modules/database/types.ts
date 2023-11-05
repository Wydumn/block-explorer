import {
    FindTreeOptions,
    ObjectLiteral,
    Repository,
    SelectQueryBuilder,
    TreeRepository,
} from 'typeorm';

import { BaseRepository, BaseTreeRepository } from './base';
import { OrderType, SelectTrashMode } from './constants';

export type QueryHook<Entity> = (
    qb: SelectQueryBuilder<Entity>,
) => Promise<SelectQueryBuilder<Entity>>;

/**
 * pagination meta data
 */
export interface PaginateMeta {
    /**
     * page number
     */
    itemCount: number;
    totalItems?: number;
    perPage: number;
    totalPages?: number;
    currentPage: number;
}

export interface PaginateOptions {
    /**
     * current page
     */
    page: number;
    /**
     * page size
     */
    limit: number;
}

/**
 * return paginated data
 */
export interface PaginateReturn<E extends ObjectLiteral> {
    meta: PaginateMeta;
    items: E[];
}

/**
 * order type,{field: orderType}
 * array if multi order
 * default DESC
 */
export type OrderQueryType =
    | string
    | { name: string; order: `${OrderType}` }
    | Array<{ name: string; order: `${OrderType}` } | string>;

/**
 * type for query parameters
 */
export interface QueryParams<E extends ObjectLiteral> {
    addQuery?: QueryHook<E>;
    orderBy?: OrderQueryType;
    withTrashed?: boolean;
    onlyTrashed?: boolean;
}

/**
 * type for service query
 */
export type ServiceListQueryOption<E extends ObjectLiteral> =
    | ServiceListQueryOptionWithTrashed<E>
    | ServiceListQueryOptionNotWithTrashed<E>;

/**
 * ServiceList query options with soft delete
 */
type ServiceListQueryOptionWithTrashed<E extends ObjectLiteral> = Omit<
    FindTreeOptions & QueryParams<E>,
    'withTrashed'
> & {
    trashed?: `${SelectTrashMode}`;
} & Record<string, any>;

/**
 * ServiceList query options without soft delete
 */
type ServiceListQueryOptionNotWithTrashed<E extends ObjectLiteral> = Omit<
    ServiceListQueryOptionWithTrashed<E>,
    'trashed'
>;

// src/modules/database/types.ts
/**
 * RepositoryType
 */
export type RepositoryType<E extends ObjectLiteral> =
    | Repository<E>
    | TreeRepository<E>
    | BaseRepository<E>
    | BaseTreeRepository<E>;
