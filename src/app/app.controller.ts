import { Controller, Get, HttpCode, HttpStatus, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtIdentityGuard } from './modules/identity/jwtIdentity/jwtIdentity.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Check API status' })
  @ApiOkResponse({ description: 'The service is operating correctly' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBadRequestResponse({
    description: 'Communication error with the server',
  })
  @ApiServiceUnavailableResponse({
    description: 'The service is not available',
  })
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @ApiExcludeEndpoint()
  @ApiBearerAuth()
  @UseGuards(JwtIdentityGuard)
  @Get('private')
  getPrivate(@Request() req) {
    return req.user;
  }
}
