import { Module, CacheModule } from '@nestjs/common';
import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { RadisCacheService } from './radis-cache.service';

@Module({
  controllers: [],
  providers: [RadisCacheService],
  imports: [
    CacheModule.register<ClientOpts>({
      // @ts-ignore
      store: redisStore,
      host: 'localhost',
      port: 6379
    })

  ]
})
export class RadisCacheModule { }
