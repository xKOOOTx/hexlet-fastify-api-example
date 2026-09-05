import "@typespec/http";
import "@typespec/openapi";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@service(#{
    title: "Hexlet Fastify Rest Api Example",
})

namespace FastifyRestApiExample;

model PageMeta {
    page: int32;
    perPage: int32;
    total: int32;
    totalPages: int32;
}

model User {
    id: numeric;
    fullName: string | null;
    email: string;
    updatedAt: string | null;
    createdAt: string;
}
model UserCreateDTO {
    ...OmitProperties<User, "id" | "createdAt" | "updatedAt">;
    password: string;
}
model UserEditDTO {
    ...OptionalProperties<UserCreateDTO>
}

@route("/users")
namespace users {
    @get
    @useAuth(BearerAuth)
    @operationId("usersIndex")
    op index(
        @query @minValue(1) page?: int32 = 1,
        @query @minValue(1) @maxValue(100) perPage?: int32 = 10,
    ): {
        @body _: {
            data: User[];
            meta: PageMeta
        };
    } | UnauthorizedError;

    @get
    @useAuth(BearerAuth)
    @operationId("usersShow")
    op show(@path id: numeric): {
        @body _: User;
    } | NotFoundError | UnauthorizedError;

    @post
    @operationId("usersCreate")
    op create(@body user: UserCreateDTO): {
        @statusCode statusCode: 201;
        @body _: User;
    } | UnprocessableEntityError;

    @patch
    @useAuth(BearerAuth)
    @operationId("usersUpdate")
    op update(@path id: numeric, @body user: UserEditDTO): {
        @body _: User;
    } | NotFoundError | UnprocessableEntityError | UnauthorizedError;

    @delete
    @useAuth(BearerAuth)
    @operationId("usersDelete")
    op remove(@path id: numeric): {
        @statusCode statusCode: 204;
    } | NotFoundError | UnauthorizedError;
}

model Course {
    id: numeric;
    name: string;
    description: string;
    createdAt: string;
}
model CourseCreate {
    ...OmitProperties<Course, "id" | "createdAt" | "creatorId">
}
model CourseEditDTO {
    name?: string;
    description?: string;
}

@route("/courses")
namespace courses {
    @get
    @useAuth(BearerAuth)
    @operationId("coursesIndex")
    op index(
        @query @minValue(1) page?: int32 = 1,
        @query @minValue(1) @maxValue(100) perPage?: int32 = 10
    ): {
        @body _: {
            data: Course[];
            meta: PageMeta;
        };
    } | UnauthorizedError;

    @get
    @useAuth(BearerAuth)
    @operationId("coursesShow")
    op show(@path id: numeric): {
        @body _: Course;
    } | NotFoundError | UnauthorizedError;

    @patch
    @useAuth(BearerAuth)
    @operationId("courseUpdate")
    op update(@path id: numeric, @body _: CourseEditDTO): {
        @body _: Course
    } | NotFoundError | ForbiddenError;

    @post
    @useAuth(BearerAuth)
    @operationId("coursesCreate")
    op create(@body course: CourseCreate): {
        @statusCode statusCode: 201;
        @body _: Course;
    } | UnprocessableEntityError;

    @delete
    @useAuth(BearerAuth)
    @operationId("coursesDelete")
    op remove(@path id: numeric): {
        @statusCode statusCode: 204;
    } | NotFoundError | UnauthorizedError | ForbiddenError;
}

model Lesson {
    id: numeric;
    name: string;
    courseId: numeric;
    body: string;
    createdAt: string;
}
model LessonCreate {
    ...OmitProperties<Lesson, "id" | "createdAt" | "courseId">
}

@route("/courses/{courseId}/lessons")
namespace lessons {
    @get
    @useAuth(BearerAuth)
    @operationId("coursesLessonsIndex")
    op index(
        @path courseId: numeric,
        @query @minValue(1) page?: int32 = 1,
        @query @minValue(1) @maxValue(100) perPage?: int32 = 10
    ): {
        @body lessons: {
            data: Lesson[];
            meta: PageMeta;
        };
    } | UnauthorizedError;

    @get
    @useAuth(BearerAuth)
    @operationId("coursesLessonsShow")
    op show(@path courseId: numeric, @path id: numeric): {
        @body _: Lesson;
    } | NotFoundError | UnauthorizedError;

    @post
    @useAuth(BearerAuth)
    @operationId("coursesLessonsCreate")
    op create(@path courseId: numeric, @body lesson: LessonCreate): {
        @statusCode statusCode: 201;
        @body _: Lesson;
    } | UnprocessableEntityError;

    @delete
    @useAuth(BearerAuth)
    @operationId("coursesLessonsDelete")
    op remove(@path courseId: numeric, @path id: numeric): {
        @statusCode statusCode: 204;
    } | NotFoundError | UnauthorizedError;
}

model Credentials {
    email: string;
    password: string;
}
model Token {
    token: string;
}

@error
model ProblemDetails {
  @header("content-type") contentType: "application/problem+json";
  type?: string;
  title?: string;
  status?: integer;
  detail?: string;
  instance?: string;
}
@error
model UnauthorizedError {
  @statusCode _: 401;
  ...ProblemDetails;
}
@error
model ForbiddenError {
  @statusCode _: 403;
  ...ProblemDetails;
}
@error
model NotFoundError {
    @statusCode _: 404;
    ...ProblemDetails;
}
@error
model UnprocessableEntityError {
  @statusCode _: 422;
  ...ProblemDetails;
  errors: Array<{
    message: string;
    rule: string;
    field: string;
  }>;
}

@route("/tokens")
namespace tokens {
    @post
    @operationId("tokensCreate")
    op create(@body _: Credentials): {
        @body _: Token;
        @statusCode statusCode: 201;
    } | NotFoundError;
}