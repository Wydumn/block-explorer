import { BullModuleOptions } from "@nestjs/bull";

export const bullConfig: BullModuleOptions = ({
  redis: {
    host: 'localhost',
    port: 6379,
  }
})