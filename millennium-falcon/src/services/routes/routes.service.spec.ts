import { Test, TestingModule } from '@nestjs/testing';
import { RoutesService } from 'services/routes/routes.service';
import { RepositoryModule } from 'repositories/repositoryModule';
import { ConfigModule } from '@nestjs/config';
import universeJson from 'config/configuration';
import { RouteRepository } from 'repositories/route/route.repository';
import { Route } from 'models/route.model';
import spyOn = jest.spyOn;

describe('RoutesService', () => {
  let service: RoutesService;
  let routeRepository: RouteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RepositoryModule,
        ConfigModule.forRoot({
          load: [universeJson],
          isGlobal: true,
        }),
      ],
      providers: [RoutesService],
    }).compile();
    service = module.get<RoutesService>(RoutesService);
    routeRepository = module.get<RouteRepository>(RouteRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should just forward the routes', async () => {
    spyOn(routeRepository, 'getAllRoutes').mockReturnValue(
      Promise.resolve([
        {
          origin: 'A',
          destination: 'B',
          travel_time: 1,
        },
      ] as Route[]),
    );
    const routes: Route[] = await service.getAllRoutes();
    expect(routes).toBeDefined();
    expect(routes.length).toEqual(1);
    const route: Route = routes[0];
    expect(route).toBeDefined();
    expect(route.origin).toBeDefined();
    expect(route.origin).toEqual('A');
    expect(route.destination).toBeDefined();
    expect(route.destination).toEqual('B');
    expect(route.travel_time).toBeDefined();
    expect(route.travel_time).toEqual(1);
  });

  it('should just forward the routes', async () => {
    const retrieveIssue = 'retrieve issue';
    spyOn(routeRepository, 'getAllRoutes').mockReturnValue(
      Promise.reject(new Error('retrieve issue')),
    );
    try {
      await service.getAllRoutes();
    } catch (e) {
      expect(e.message).toEqual(retrieveIssue);
    }
  });
});
