declare type RecordAny = Record<string, any>;
declare type RecordNever = Record<never, never>;
declare type RecordAnyOrNever = RecordAny | RecordNever;
declare type BaseType = boolean | number | string | undefined | null;

/**
 * parse env type
 */
declare type ParseType<T extends BaseType = string> = (value: string) => T;

/**
 * Class to plain object
 */
declare type ClassToPlain<T> = { [key in keyof T]: T[key] };

/**
 * Class type
 */
declare type ClassType<T> = { new (...args: any[]): T };

/**
 * optional for nested objects
 */
declare type RePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] | undefined
        ? RePartial<U>[]
        : T[P] extends object | undefined
        ? T[P] extends ((...args: any[]) => any) | ClassType<T[P]> | undefined
            ? T[P]
            : RePartial<T[P]>
        : T[P];
};

/**
 * required for nested objects
 */
declare type ReRequired<T> = {
    [P in keyof T]-?: T[P] extends (infer U)[] | undefined
        ? ReRequired<U>[]
        : T[P] extends object | undefined
        ? T[P] extends ((...args: any[]) => any) | ClassType<T[P]> | undefined
            ? T[P]
            : ReRequired<T[P]>
        : T[P];
};

/**
 * avoid circular reference for SWC
 */
declare type WrapperType<T> = T; // WrapperType === Relation
