import { Module } from '@nestjs/common';
import { RouteRepository } from 'repositories/route/route.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [RouteRepository],
  exports: [RouteRepository],
})
export class RepositoryModule {}
