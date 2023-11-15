# block explorer
A simple Ethereum blockchain explorer

crawl blocks from RPC nodes, parse blocks and transactions data, index them and search

## Technology Stack
NestJS/fastify, MySQL/TypeORM, Elasticsearch, BullMQ

## Quick Start
1. start up container `docker compose up`
2. install all dependencies `pnpm i`
3. start backend `pnpm start`

## Todo
- [ ] parse transactions and store
- [ ] check data integrity
- [ ] reduce request rate to block generation rate after synchronization
- [ ] rate limit
