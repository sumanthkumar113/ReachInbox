import { Test } from "@nestjs/testing";
import {
  INestApplication,
  HttpStatus,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import request from "supertest";
import { ACGuard } from "nest-access-control";
import { DefaultAuthGuard } from "../../auth/defaultAuth.guard";
import { ACLModule } from "../../auth/acl.module";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { map } from "rxjs";
import { EmailController } from "../email.controller";
import { EmailService } from "../email.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  id: "exampleId",
  createdAt: new Date(),
  updatedAt: new Date(),
  fromName: "exampleFromName",
  fromEmail: "exampleFromEmail",
  toName: "exampleToName",
  toEmail: "exampleToEmail",
  cc: "exampleCc",
  bcc: "exampleBcc",
  threadId: 42,
  messageId: "exampleMessageId",
  inReplyTo: "exampleInReplyTo",
  body: "exampleBody",
  isRead: "true",
  folder: "exampleFolder",
  uid: 42,
  sentAt: new Date(),
  archivedAt: new Date(),
  deletedAt: new Date(),
  references: "exampleReferences",
  subject: "exampleSubject",
};
const CREATE_RESULT = {
  id: "exampleId",
  createdAt: new Date(),
  updatedAt: new Date(),
  fromName: "exampleFromName",
  fromEmail: "exampleFromEmail",
  toName: "exampleToName",
  toEmail: "exampleToEmail",
  cc: "exampleCc",
  bcc: "exampleBcc",
  threadId: 42,
  messageId: "exampleMessageId",
  inReplyTo: "exampleInReplyTo",
  body: "exampleBody",
  isRead: "true",
  folder: "exampleFolder",
  uid: 42,
  sentAt: new Date(),
  archivedAt: new Date(),
  deletedAt: new Date(),
  references: "exampleReferences",
  subject: "exampleSubject",
};
const FIND_MANY_RESULT = [
  {
    id: "exampleId",
    createdAt: new Date(),
    updatedAt: new Date(),
    fromName: "exampleFromName",
    fromEmail: "exampleFromEmail",
    toName: "exampleToName",
    toEmail: "exampleToEmail",
    cc: "exampleCc",
    bcc: "exampleBcc",
    threadId: 42,
    messageId: "exampleMessageId",
    inReplyTo: "exampleInReplyTo",
    body: "exampleBody",
    isRead: "true",
    folder: "exampleFolder",
    uid: 42,
    sentAt: new Date(),
    archivedAt: new Date(),
    deletedAt: new Date(),
    references: "exampleReferences",
    subject: "exampleSubject",
  },
];
const FIND_ONE_RESULT = {
  id: "exampleId",
  createdAt: new Date(),
  updatedAt: new Date(),
  fromName: "exampleFromName",
  fromEmail: "exampleFromEmail",
  toName: "exampleToName",
  toEmail: "exampleToEmail",
  cc: "exampleCc",
  bcc: "exampleBcc",
  threadId: 42,
  messageId: "exampleMessageId",
  inReplyTo: "exampleInReplyTo",
  body: "exampleBody",
  isRead: "true",
  folder: "exampleFolder",
  uid: 42,
  sentAt: new Date(),
  archivedAt: new Date(),
  deletedAt: new Date(),
  references: "exampleReferences",
  subject: "exampleSubject",
};

const service = {
  createEmail() {
    return CREATE_RESULT;
  },
  emails: () => FIND_MANY_RESULT,
  email: ({ where }: { where: { id: string } }) => {
    switch (where.id) {
      case existingId:
        return FIND_ONE_RESULT;
      case nonExistingId:
        return null;
    }
  },
};

const basicAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const argumentHost = context.switchToHttp();
    const request = argumentHost.getRequest();
    request.user = {
      roles: ["user"],
    };
    return true;
  },
};

const acGuard = {
  canActivate: () => {
    return true;
  },
};

const aclFilterResponseInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle().pipe(
      map((data) => {
        return data;
      })
    );
  },
};
const aclValidateRequestInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle();
  },
};

describe("Email", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: EmailService,
          useValue: service,
        },
      ],
      controllers: [EmailController],
      imports: [ACLModule],
    })
      .overrideGuard(DefaultAuthGuard)
      .useValue(basicAuthGuard)
      .overrideGuard(ACGuard)
      .useValue(acGuard)
      .overrideInterceptor(AclFilterResponseInterceptor)
      .useValue(aclFilterResponseInterceptor)
      .overrideInterceptor(AclValidateRequestInterceptor)
      .useValue(aclValidateRequestInterceptor)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test("POST /emails", async () => {
    await request(app.getHttpServer())
      .post("/emails")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
        sentAt: CREATE_RESULT.sentAt.toISOString(),
        archivedAt: CREATE_RESULT.archivedAt.toISOString(),
        deletedAt: CREATE_RESULT.deletedAt.toISOString(),
      });
  });

  test("GET /emails", async () => {
    await request(app.getHttpServer())
      .get("/emails")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          createdAt: FIND_MANY_RESULT[0].createdAt.toISOString(),
          updatedAt: FIND_MANY_RESULT[0].updatedAt.toISOString(),
          sentAt: FIND_MANY_RESULT[0].sentAt.toISOString(),
          archivedAt: FIND_MANY_RESULT[0].archivedAt.toISOString(),
          deletedAt: FIND_MANY_RESULT[0].deletedAt.toISOString(),
        },
      ]);
  });

  test("GET /emails/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/emails"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /emails/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/emails"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        createdAt: FIND_ONE_RESULT.createdAt.toISOString(),
        updatedAt: FIND_ONE_RESULT.updatedAt.toISOString(),
        sentAt: FIND_ONE_RESULT.sentAt.toISOString(),
        archivedAt: FIND_ONE_RESULT.archivedAt.toISOString(),
        deletedAt: FIND_ONE_RESULT.deletedAt.toISOString(),
      });
  });

  test("POST /emails existing resource", async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post("/emails")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
        sentAt: CREATE_RESULT.sentAt.toISOString(),
        archivedAt: CREATE_RESULT.archivedAt.toISOString(),
        deletedAt: CREATE_RESULT.deletedAt.toISOString(),
      })
      .then(function () {
        agent
          .post("/emails")
          .send(CREATE_INPUT)
          .expect(HttpStatus.CONFLICT)
          .expect({
            statusCode: HttpStatus.CONFLICT,
          });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
