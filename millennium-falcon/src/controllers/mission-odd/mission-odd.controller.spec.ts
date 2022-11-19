import { Test, TestingModule } from "@nestjs/testing";
import { MissionOddController } from "./mission-odd.controller";

describe("MissionOddController", () => {
  let controller: MissionOddController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionOddController]
    }).compile();

    controller = module.get<MissionOddController>(MissionOddController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
