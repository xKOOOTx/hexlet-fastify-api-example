import "@typespec/http";

using TypeSpec.Http;

@service(#{
    title: "Hexlet Fastify Rest Api Example",
})

namespace FastifyRestApiExample;

model User {
    id: numeric;
    fullName: string | null;
    email: string;
    updatedAt: string;
    createdAt: string;
}
model UserCreate {
    ...OmitProperties<User, "id" | "createdAt" | "updatedAt">
}

@route("/users")
namespace users {
    @get

    @useAuth(BearerAuth)

    op index(@query page?: numeric = 1): {
        @body _: {
            data: User[];
        };
    };

    @get
    op show(@path id: numeric): {
        @body _: User;
    };

    @post
    op create(@body user: UserCreate): {
        @statusCode statusCode: 201;
        @body _: User;
    };

    @delete
    op remove(@path id: numeric): {
        @statusCode statusCode: 204;
    };
}