import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { PathsObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { AppConfigHelper } from './app/helpers';

const appConfig = new AppConfigHelper(new ConfigService());

// eslint-disable-next-line unused-imports/no-unused-vars, no-unused-vars
function filterInternalRoutes(doc: OpenAPIObject, tag) {
  // eslint-disable-next-line no-undef
  const publicDoc = structuredClone(doc);
  const paths: PathsObject = {};

  Object.entries(publicDoc.paths).map(([k, path]) => {
    if (k.includes('/web/')) {
      paths[k] = path;
    }
  });

  publicDoc.paths = paths;
  return publicDoc;
}

const defaultSwaggerOpts = {
  swaggerOptions: {
    docExpansion: false,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  },
};

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle(appConfig.api.API_TITLE)
    .setDescription(appConfig.api.API_DESCRIPTION)
    .setVersion(appConfig.api.API_VERSION)
    .addServer(appConfig.api.API_HOST)
    .setExternalDoc('Postman Collection', '/docs-json')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const publicDoc = filterInternalRoutes(document, 'web');

  SwaggerModule.setup('/docs', app, document, defaultSwaggerOpts);
  SwaggerModule.setup('/docs/web', app, publicDoc, defaultSwaggerOpts);
}
