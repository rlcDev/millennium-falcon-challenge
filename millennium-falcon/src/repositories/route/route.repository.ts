import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Route } from 'models/route.model';

@Injectable()
export class RouteRepository {
  constructor(@InjectModel(Route) private readonly routeModel: typeof Route) {}

  async getAllRoutes(): Promise<Route[]> {
    return this.routeModel.findAll({
      attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
    });
  }
}
