import {Body, Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {EmpireService} from 'services/empire/empire.service';
import {ApiConsumes, ApiOkResponse} from '@nestjs/swagger';
import {ODD_PROPERLY_COMPUTE} from 'controllers/constants/controllers.contants';
import {OddMissionService} from "services/odd-mission/odd-mission.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {EmpireDto} from "controllers/dto/empire.dto";
import {Response} from "express";
import {OddResponse} from "../models/api-response.model";
import {OK} from "sqlite3";

@Controller({path: 'mission'})
export class EmpireController {
    constructor(private readonly empireService: EmpireService, private readonly oddMissionService: OddMissionService) {
    }

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: ODD_PROPERLY_COMPUTE
    })
    @ApiConsumes('multipart/form-data')
    @Post('odd')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file: Express.Multer.File, @Body() empireDto, @Res() response: Response) {
        const empireDtoParsed: EmpireDto = JSON.parse(empireDto.file);
        const odd: number = this.oddMissionService.tellMeTheOdds(this.empireService.processImportedEmpire(empireDtoParsed));
        const OddResponse : OddResponse = {value: odd, message: 'ok'}
        response.status(HttpStatus.OK).json(OddResponse);

    }
}
