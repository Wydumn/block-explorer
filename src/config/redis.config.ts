import { RedisModuleOptions } from "@/modules/redis/types";

export const redis: RedisModuleOptions = {
  url: process.env.REDIS_URI,
};