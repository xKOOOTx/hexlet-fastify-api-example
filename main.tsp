import "@typespec/http";
import "@typespec/openapi";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@service(#{
    title: "Hexlet Fastify Rest Api Example",
})

namespace FastifyRestApiExample;

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
    op index(@query page?: numeric = 1): {
        @body _: {
            data: User[];
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

@route("/courses")
namespace courses {
    @get
    @useAuth(BearerAuth)
    @operationId("coursesIndex")
    op index(@query page?: numeric = 1): {
        @body _: {
            data: Course[];
        };
    };

    @get
    @useAuth(BearerAuth)
    @operationId("coursesShow")
    op show(@path id: numeric): {
        @body _: Course;
    };

    @post
    @useAuth(BearerAuth)
    @operationId("coursesCreate")
    op create(@body course: CourseCreate): {
        @statusCode statusCode: 201;
        @body _: Course;
    };

    @delete
    @useAuth(BearerAuth)
    @operationId("coursesDelete")
    op remove(@path id: numeric): {
        @statusCode statusCode: 204;
    };
}

model Lesson {
    id: numeric;
    name: string;
    courseId: numeric;
    body: string;
    createdAt: string;
}
model LessonCreate {
    ...OmitProperties<Lesson, "id" | "createdAt">
}

@route("/lessons")
namespace lessons {
    @get
    @useAuth(BearerAuth)
    @operationId("lessonsIndex")
    op index(@query page?: numeric = 1): {
        @body _: {
            data: Lesson[];
        };
    };

    @get
    @useAuth(BearerAuth)
    @operationId("lessonsShow")
    op show(@path id: numeric): {
        @body _: Lesson;
    };

    @post
    @useAuth(BearerAuth)
    @operationId("lessonsCreate")
    op create(@body lesson: LessonCreate): {
        @statusCode statusCode: 201;
        @body _: Lesson;
    };

    @delete
    @useAuth(BearerAuth)
    @operationId("lessonsDelete")
    op remove(@path id: numeric): {
        @statusCode statusCode: 204;
    };
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
model NotFoundError {
    @statusCode _: 404;
    ...ProblemDetails;
}
@error
model UnauthorizedError {
  @statusCode _: 401;
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