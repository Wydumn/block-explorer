import { isNil } from 'lodash';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

import { OrderType } from '../constants';
import { getOrderByQuery } from '../helpers';
import { OrderQueryType } from '../types';

export abstract class BaseRepository<E extends ObjectLiteral> extends Repository<E> {
    /**
     * default queryBuilder name 
     */
    protected abstract _qbName: string;

    /**
     * default order
     */
    protected orderBy?: string | { name: string; order: `${OrderType}` };

    get qbName() {
        return this._qbName;
    }

    buildBaseQB(): SelectQueryBuilder<E> {
        return this.createQueryBuilder(this.qbName);
    }

    /**
     * generate order QueryBuilder
     * @param qb
     * @param orderBy
     */
    addOrderByQuery(qb: SelectQueryBuilder<E>, orderBy?: OrderQueryType) {
        const orderByQuery = orderBy ?? this.orderBy;
        return !isNil(orderByQuery) ? getOrderByQuery(qb, this.qbName, orderByQuery) : qb;
    }
}
