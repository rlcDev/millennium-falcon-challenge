import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Route } from "models/route.model";
import { ConfigService } from "@nestjs/config";
import { Observable, Subscriber } from "rxjs";
import path from "path";
import { Database } from "sqlite3";

@Injectable()
export class RouteRepository implements OnModuleDestroy {
  SELECT_ALL_ROUTES_QUERY = "SELECT ORIGIN,DESTINATION,TRAVEL_TIME FROM ROUTES";
  db: Database;

  constructor(private readonly configService: ConfigService) {
    const databasePath = path.join(
      "resources",
      this.configService.get<string>("routes_db")
    );
    this.db = new Database(databasePath);
  }


  async getAllRoutes(): Promise<Route[]> {
    return new Promise((resolve, reject) => {
      this.db.all(this.SELECT_ALL_ROUTES_QUERY, (error, routes: Route[]) => {
        if (error) {
          reject(error);
        }
        resolve(routes);
      });
    });
  }

  onModuleDestroy(): any {
    this.db.close();
  }
}
