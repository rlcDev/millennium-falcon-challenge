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
import { EmpireDto } from 'controllers/dto/empire.dto';
import { EmpireError } from 'services/errors/empire.error';

@ApiTags('Mission odd')
@Controller({ path: 'mission', version: '1' })
export class OddMissionController {
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
      const empireDto = JSON.parse(file.buffer.toString()) as EmpireDto;
      const odd: number = await this.oddMissionService.tellMeTheOdds(empireDto);
      response.status(HttpStatus.OK).json({
        message: odd.toString(),
        statusCode: HttpStatus.OK,
        error: null,
      } as OddResponse);
    } catch (error) {
      if (error instanceof EmpireError) {
        response.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
          error: IMPORTED_FILE_ISSUE,
          statusCode: HttpStatus.BAD_REQUEST,
        } as OddResponse);
      } else {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: error.message,
          error: INTERNAL_ERROR,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        } as OddResponse);
      }
    }
  }
}
