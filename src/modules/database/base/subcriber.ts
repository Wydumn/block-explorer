import { Optional } from '@nestjs/common';
import { isNil } from 'lodash';
import {
    EntitySubscriberInterface,
    EventSubscriber,
    ObjectLiteral,
    ObjectType,
    UpdateEvent,
    InsertEvent,
    SoftRemoveEvent,
    RemoveEvent,
    RecoverEvent,
    TransactionStartEvent,
    TransactionCommitEvent,
    TransactionRollbackEvent,
    EntityTarget,
    DataSource,
} from 'typeorm';

import { getCustomRepository } from '../helpers';

import { RepositoryType } from '../types';

type SubscriberEvent<E extends ObjectLiteral> =
    | InsertEvent<E>
    | UpdateEvent<E>
    | SoftRemoveEvent<E>
    | RemoveEvent<E>
    | RecoverEvent<E>
    | TransactionStartEvent
    | TransactionCommitEvent
    | TransactionRollbackEvent;

/**
 * base subscriber
 */
@EventSubscriber()
export abstract class BaseSubscriber<E extends ObjectLiteral>
    implements EntitySubscriberInterface<E>
{
    /**
     * entity to subscribe
     */
    protected abstract entity: ObjectType<E>;

    /**
     * constructor
     * @param dataSource connection pool
     */
    constructor(@Optional() protected dataSource?: DataSource) {
        if (!isNil(this.dataSource)) this.dataSource.subscribers.push(this);
    }

    protected getDataSource(event: SubscriberEvent<E>) {
        return this.dataSource ?? event.connection;
    }

    protected getManage(event: SubscriberEvent<E>) {
        return this.dataSource ? this.dataSource.manager : event.manager;
    }

    listenTo() {
        return this.entity;
    }

    async afterLoad(entity: any) {
        // enable tree entity
        if ('parent' in entity && isNil(entity.depth)) entity.depth = 0;
    }

    protected getRepositoy<
        C extends ClassType<T>,
        T extends RepositoryType<E>,
        A extends EntityTarget<ObjectLiteral>,
    >(event: SubscriberEvent<E>, repository?: C, entity?: A) {
        return isNil(repository)
            ? this.getDataSource(event).getRepository(entity ?? this.entity)
            : getCustomRepository<T, E>(this.getDataSource(event), repository);
    }

    /**
     * if the field updated
     * @param cloumn
     * @param event
     */
    protected isUpdated(cloumn: keyof E, event: UpdateEvent<E>) {
        return !!event.updatedColumns.find((item) => item.propertyName === cloumn);
    }
}
