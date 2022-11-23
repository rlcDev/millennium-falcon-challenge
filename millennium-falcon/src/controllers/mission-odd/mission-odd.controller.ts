import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  IMPORTED_FILE_ISSUE,
  INTERNAL_ERROR,
  ODD_PROPERLY_COMPUTE,
} from 'controllers/constants/controllers.contants';
import { OddMissionService } from 'services/odd-mission/odd-mission.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { OddResponse } from 'controllers/models/api-response.model';
import { EmpireDto } from '../dto/empire.dto';

@ApiTags('Mission odd')
@Controller({ path: 'mission', version: '1' })
export class MissionOddController {
  constructor(private readonly oddMissionService: OddMissionService) {}

  @Post('odd')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: ODD_PROPERLY_COMPUTE,
  })
  @ApiInternalServerErrorResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: INTERNAL_ERROR,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: IMPORTED_FILE_ISSUE,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async getOdd(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'json' })],
      }),
    )
    file: Express.Multer.File,
    @Res() response: Response,
  ) {
    try {
      let empireDto: EmpireDto = JSON.parse(file.buffer.toString());
      const odd: number = await this.oddMissionService.tellMeTheOdds(empireDto);
      const OddResponse: OddResponse = {
        message: odd.toString(),
        statusCode: HttpStatus.OK,
        error: null,
      };
      response.status(HttpStatus.OK).json(OddResponse);
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: INTERNAL_ERROR,
        error: error.message,
        statusCode: 400,
      } as OddResponse);
    }
  }
}
