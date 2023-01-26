import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  controllers: [],
  providers: [EventsGateway]
})
export class EventsModule { }
