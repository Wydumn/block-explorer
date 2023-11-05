export const CUSTOM_REPOSITORY_METADATA = 'CUSTOM_REPOSITORY_METADATA';
/**
 * soft delete query options
 */
export enum SelectTrashMode {
    ALL = 'all',
    ONLY = 'only',
    NONE = 'none',
}

/**
 * order type
 */
export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC',
}

/**
 * resolver when tree entity delete parent
 */
export enum TreeChildrenResolve {
    DELETE = 'delete',
    UP = 'up',
    ROOT = 'root',
}
