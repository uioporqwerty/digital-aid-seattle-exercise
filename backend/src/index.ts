import Fastify from "fastify";
import cors from "@fastify/cors";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { donationRoutes } from "./routes/donations";
import { HealthSchema, ApiInfoSchema } from "./schemas";

/**
 * Build and configure the Fastify server
 */
async function buildServer() {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info",
      transport:
        process.env.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
              },
            }
          : undefined,
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Register CORS plugin to allow frontend requests
  await server.register(cors, {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // Health check endpoint
  server.get(
    "/health",
    {
      schema: {
        response: {
          200: HealthSchema,
        },
      },
    },
    async (_request, _reply) => {
      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
      };
    }
  );

  // API info endpoint
  server.get(
    "/api",
    {
      schema: {
        response: {
          200: ApiInfoSchema,
        },
      },
    },
    async (_request, _reply) => {
      return {
        name: "Digital Aid Seattle API",
        version: "1.0.0",
        description: "Backend API for donation management system",
        endpoints: {
          donations: "/api/donations",
          health: "/health",
          stats: "/api/donations/stats",
        },
      };
    }
  );

  await server.register(donationRoutes, { prefix: "/api" });

  server.setErrorHandler(async (error, _request, reply) => {
    server.log.error(error);

    if (error.validation) {
      reply.status(400).send({
        error: "Validation failed",
        details: error.validation,
      });
      return;
    }

    reply.status(500).send({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  });

  server.setNotFoundHandler(async (request, reply) => {
    reply.status(404).send({
      error: "Not found",
      message: `Route ${request.method} ${request.url} not found`,
    });
  });

  return server;
}

async function start() {
  try {
    const server = await buildServer();

    const port = Number(process.env.PORT) || 3001;
    const host = process.env.HOST || "0.0.0.0";

    await server.listen({ port, host });

    server.log.info(
      `Digital Aid Seattle API server is running on http://${host}:${port}`
    );
    server.log.info(`Health check available at http://${host}:${port}/health`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  console.log("\nReceived SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nReceived SIGTERM, shutting down gracefully...");
  process.exit(0);
});

if (require.main === module) {
  start();
}

export { buildServer, start };
