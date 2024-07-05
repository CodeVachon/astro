---
title: TypeScript Generic Cache Class
description: Exploring the creation of a generic cache class in TypeScript that can be used with any service based off of an abstract class.
date: 2024-07-05
tags:
    - web-development
image: ../../assets/blog/typescript-generic-cache-class.png
featured: false
draft: false
---

Today I was writing a cache class in TypeScript and I wanted to make it generic so that it could be used with any service based off of an abstract class. Here is the code I came up with.

Starting with the abstract class for services:

```typescript
// Abstract class for services

interface IBaseRecord {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    isArchived: boolean;
}

export abstract class BaseService<TRecord extends IBaseRecord = IBaseRecord> {
    protected connection: DBConnection;
    protected abstract tableName: string;

    constructor(connection: DBConnection) {
        this.connection = connection;
    }

    getItem(id: string): Promise<TRecord> {
        return this.connection.execute(
            `
            SELECT *
            FROM ${this.tableName}
            WHERE id = ?
            `,
            [id]
        );
    }
}
```

Next we implement the `BaseService`.

```typescript
// Implementation of BaseService

interface IUserRecord extends IBaseRecord {
    email: string;
    firstName: string;
    lastName: string;
}

export class UserService extends BaseService<IUserRecord> {
    protected tableName = "users";
}

interface IJobRecord extends IBaseRecord {
    name: string;
    description: string;
}

export class JobService extends BaseService<IJobRecord> {
    protected tableName = "jobs";
}
```

Now we can create the cache class.

```typescript
// This Type will return the type of the record from the service
type IServiceRecordType<T extends BaseService> = ReturnType<T["getItem"]>;

export class InlineCache<TService extends BaseService = BaseService> {
    private cache = new Map<string, IServiceRecordType<TService>>();
    private service: TService;

    constructor(model: TService) {
        this.service = model;
    }

    async getItem(id: string) {
        const current = this.cache.get(id);
        if (current) {
            return current;
        }
        const record = (await this.service.getItem(id)) as IServiceRecordType<TService>;
        this.cache.set(id, record);
        return record;
    }

    clear(id?: string) {
        if (id) {
            this.cache.delete(id);
        } else {
            this.cache.clear();
        }
    }
}
```

now I can use the cache class with any service.

```typescript
const myUserService = new UserService(connection);
const myJobService = new JobService(connection);

// Pass in my Service into my InlineCache
const userCache = new InlineCache(myUserService);

const selectedUser = await userCache.getItem("123");
// TypeOf `selectedUser` is `IUserRecord`
```

Notice a few things here from the above codebase:

1. The `InlineCache` class is generic and can be used with any service that extends the `BaseService` class.
2. I did not pass any type to the `InlineCache` class when creating an instance of it. TypeScript will infer the type from the service passed in.
3. I used the `ReturnType` utility type to get the return type of the `getItem` method on the service, not the interface defined on the service.

The last point is important because the `getItem` may return more then what is defined in the interface. Let's extend the getItem() method to return more fields.

```typescript
interface IUserRecord extends IBaseRecord {
    email: string;
    firstName: string;
    lastName: string;
}

export class UserService extends BaseService<IUserRecord> {
    protected tableName = "users";

    async getItem(id: string) {
        // Get the record from the BaseService
        const record = super.getItem(id);

        // Get Jobs for that User
        const jobs = await new JobService(this.connection).getJobsForUser(id);

        return {
            ...record,
            jobs
        };
    }
}

// Instantiate the serice class with the connection
const myUserService = new UserService(connection);

// Pass in my Service into my InlineCache
const userCache = new InlineCache(myUserService);

// Get the select user
const selectedUser = await userCache.getItem("123");
// TypeOf `selectedUser` is `IUserRecord & { jobs: IJobRecord[] }`
```

This makes the `InlineCache` class very flexible and easily reusable with any service that extends the `BaseService` class.
