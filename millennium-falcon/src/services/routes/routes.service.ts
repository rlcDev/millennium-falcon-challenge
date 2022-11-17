import { Injectable } from '@nestjs/common';
import { RouteRepository } from 'repositories/route/route.repository';
import { Route } from 'models/route.model';
import {from, map, Observable} from "rxjs";

@Injectable()
export class RoutesService {
  constructor(private readonly routeRepository: RouteRepository) {
  }

  getAllRoutes(): Observable<Route[]> {
    return from(this.routeRepository.getAllRoutes());
  }
}
