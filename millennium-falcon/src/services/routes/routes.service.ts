import { Injectable } from '@nestjs/common';
import { Route } from 'models/route.model';
import { RouteRepository } from 'repositories/route/route.repository';

@Injectable()
export class RoutesService {
  constructor(private readonly routeRepository: RouteRepository) {}

  async getAllRoutes(): Promise<Route[]> {
    return await this.routeRepository.getAllRoutes();
  }
}
