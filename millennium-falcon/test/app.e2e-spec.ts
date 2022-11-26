import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { OddResponse } from "controllers/models/api-response.model";

describe("MissionOdd (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/POST mission odd should return 81 and no error for empire8", () => {
    const filePath = `${__dirname}/samples/empire8.json`;
    return request(app.getHttpServer())
      .post("/mission/odd/")
      .attach("file", filePath)
      .type("multipart/form-data")
      .then((res) => {
        assertResponse(res.body, "81", null, HttpStatus.OK);
      });
  });

  it("/POST mission odd should return 400 with error when the format is wrong", () => {
    const filePath = `${__dirname}/samples/empire-wrong-format.csv`;
    return request(app.getHttpServer())
      .post("/mission/odd/")
      .attach("file", filePath)
      .type("multipart/form-data")
      .then((res) => {
        assertResponse(
          res.body,
          "Validation failed (expected type is json)",
          "Bad Request",
          HttpStatus.BAD_REQUEST
        );
      });
  });

  it("/POST mission odd should return 400 with error when the data is wrong", () => {
    const filePath = `${__dirname}/samples/empire8-wrong-data.json`;
    return request(app.getHttpServer())
      .post("/mission/odd/")
      .attach("file", filePath)
      .type("multipart/form-data")
      .then((res) => {
        assertResponse(
          res.body,
          "Cannot read properties of undefined (reading 'forEach')",
          "Issue while computing the odd",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
  });

  it("/POST mission odd should return 400 with error when countdown is negative", () => {
    const filePath = `${__dirname}/samples/empire8-invalid-countdown.json`;
    return request(app.getHttpServer())
      .post("/mission/odd/")
      .attach("file", filePath)
      .type("multipart/form-data")
      .then((res) => {
        assertResponse(
          res.body,
          "Countdown is negative: -1",
          "Invalid provided file",
          HttpStatus.BAD_REQUEST
        );
      });
  });

  it("/POST mission odd should return 400 with error when invalid planet", () => {
    const filePath = `${__dirname}/samples/empire8-invalid-planet.json`;
    return request(app.getHttpServer())
      .post("/mission/odd/")
      .attach("file", filePath)
      .type("multipart/form-data")
      .then((res) => {
        assertResponse(
          res.body,
          "Invalid planet name: ",
          "Invalid provided file",
          HttpStatus.BAD_REQUEST
        );
      });
  });


  it("/POST mission odd should return 400 with error when invalid day on planet", () => {
    const filePath = `${__dirname}/samples/empire8-invalid-days.json`;
    return request(app.getHttpServer())
      .post("/mission/odd/")
      .attach("file", filePath)
      .type("multipart/form-data")
      .then((res) => {
        assertResponse(
          res.body,
          "Invalid day value: -5",
          "Invalid provided file",
          HttpStatus.BAD_REQUEST
        );
      });
  });

  //

  /**
   * Assert Odd response
   * @param response {OddResponse}
   * @param message {string}
   * @param error {string}
   * @param statusCode {number}
   */
  function assertResponse(
    response: OddResponse,
    message: string,
    error: string,
    statusCode: number
  ): void {
    expect(response).toBeDefined();
    expect(response.message).toBeDefined();
    expect(response.statusCode).toBeDefined();
    expect(response.message).toEqual(message);
    expect(response.statusCode).toEqual(statusCode);
    expect(response.error).toEqual(error);
  }
});
