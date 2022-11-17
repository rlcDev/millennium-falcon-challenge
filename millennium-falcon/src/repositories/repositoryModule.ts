import { Module } from '@nestjs/common';
import { RouteRepository } from 'repositories/route/route.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Route } from 'models/route.model';

@Module({
  imports: [SequelizeModule.forFeature([Route])],
  providers: [RouteRepository],
  exports: [RouteRepository],
})
export class RepositoryModule {}
