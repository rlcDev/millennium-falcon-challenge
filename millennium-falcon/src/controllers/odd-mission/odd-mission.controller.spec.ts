import { Test, TestingModule } from '@nestjs/testing';
import { OddMissionController } from 'controllers/odd-mission/odd-mission.controller';
import { ServicesModule } from 'services/services.module';
import { ConfigModule } from '@nestjs/config';
import universeJson from 'config/configuration';
import { OddMissionService } from 'services/odd-mission/odd-mission.service';
import { createResponse } from 'node-mocks-http';
import * as fs from 'fs';
import { OddResponse } from '../models/api-response.model';
import { HttpStatus } from '@nestjs/common';
import spyOn = jest.spyOn;

describe('OddMissionController', () => {
  const fileToBuffer = (filename) => {
    const readStream = fs.createReadStream(filename);
    const chunks = [];
    return new Promise((resolve, reject) => {
      readStream.on('error', (err) => {
        reject(err);
      });

      readStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      readStream.on('close', () => {
        resolve(Buffer.concat(chunks));
      });
    });
  };

  let controller: OddMissionController;
  let oddMissionService: OddMissionService;
  let file: Express.Multer.File;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ServicesModule,
        ConfigModule.forRoot({
          load: [universeJson],
          isGlobal: true,
        }),
      ],
      controllers: [OddMissionController],
    }).compile();

    controller = module.get<OddMissionController>(OddMissionController);
    oddMissionService = module.get<OddMissionService>(OddMissionService);

    const bufferFile = (await fileToBuffer(
      __dirname + '/samples/empire8.json',
    )) as Buffer;

    file = {
      buffer: bufferFile,
      fieldname: 'file',
      originalname: 'file',
      encoding: '7bit',
      mimetype: '',
      destination: 'path',
      filename: 'empire.json',
      path: 'path',
      size: 95,
      stream: null,
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should response with 200 nominal case', async () => {
    let response = createResponse();
    await controller.getOdd(file, response);
    const details: OddResponse = response._getJSONData();
    expect(details.statusCode).toBeDefined();
    expect(details.statusCode).toEqual(HttpStatus.OK);
    expect(details.error).toBeDefined();
    expect(details.error).toBe(null);
  });

  it('should response with 500 when processing errors', async () => {
    spyOn(oddMissionService, 'tellMeTheOdds').mockReturnValue(
      Promise.reject('Issue while computing the odd'),
    );
    let response = createResponse();
    await controller.getOdd(file, response);
    const details: OddResponse = response._getJSONData();
    expect(details.statusCode).toBeDefined();
    expect(details.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(details.error).toBeDefined();
    expect(details.error).toEqual('Issue while computing the odd');
  });
});
