import { Test, TestingModule } from '@nestjs/testing';
import { RouteRepository } from './route.repository';
import { ConfigModule } from '@nestjs/config';
import universeJson from 'config/configuration';
import { Route } from 'models/route.model';

describe('RouteRepository', () => {
  let repository: RouteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [universeJson],
          isGlobal: true,
        }),
      ],
      providers: [RouteRepository],
    }).compile();

    repository = module.get<RouteRepository>(RouteRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should retrieved the items properly', async () => {
    const routes: Route[] = await repository.getAllRoutes();
    expect(routes).toBeDefined();
    expect(routes.length).toEqual(5);
  });
});
