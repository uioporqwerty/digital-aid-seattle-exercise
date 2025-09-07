import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { Type } from "@sinclair/typebox";
import { donationDataService } from "../services/donationDataService";
import { DonationType } from "../types/donation";
import {
  DonationSchema,
  CreateDonationSchema,
  UpdateDonationSchema,
  DonationStatsSchema,
  DonationParamsSchema,
  ErrorSchema,
} from "../schemas";

/**
 * Donation routes plugin for Fastify
 */
export async function donationRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get(
    "/donations",
    {
      schema: {
        response: {
          200: Type.Array(DonationSchema),
          500: ErrorSchema,
        },
      },
    },
    async (_request, reply) => {
      try {
        const donations = donationDataService.getAll();
        return donations;
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  // GET /api/donations/:id - Get a specific donation
  fastify.get('/donations/:id', {
    schema: {
      params: DonationParamsSchema,
      response: {
        200: DonationSchema,
        404: ErrorSchema,
        500: ErrorSchema
      }
    }
  }, async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const donation = donationDataService.getById(id);

        if (!donation) {
          return reply.status(404).send({ error: "Donation not found" });
        }

        return donation;
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  // POST /api/donations - Create a new donation
  fastify.post(
    "/donations",
    {
      schema: {
        body: CreateDonationSchema,
        response: {
          201: DonationSchema,
          400: ErrorSchema,
          500: ErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const donationData = request.body as any;

        // Validate donation type
        if (!Object.values(DonationType).includes(donationData.type)) {
          return reply.status(400).send({ error: "Invalid donation type" });
        }

        // Validate date format
        const date = new Date(donationData.date);
        if (isNaN(date.getTime())) {
          return reply.status(400).send({ error: "Invalid date format" });
        }

        const newDonation = donationDataService.create(donationData);
        return reply.status(201).send(newDonation);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

    // PUT /api/donations/:id - Update an existing donation
  fastify.put('/donations/:id', {
    schema: {
      params: DonationParamsSchema,
      body: UpdateDonationSchema,
      response: {
        200: DonationSchema,
        404: ErrorSchema,
        400: ErrorSchema,
        500: ErrorSchema
      }
    }

  // DELETE /api/donations/:id - Delete a donation
  fastify.delete(
    "/donations/:id",
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
        response: {
          204: Type.Null(),
          404: ErrorSchema,
          500: ErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const deleted = donationDataService.delete(id);

        if (!deleted) {
          return reply.status(404).send({ error: "Donation not found" });
        }

        return reply.status(204).send();
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  // GET /api/donations/stats - Get donation statistics
  fastify.get(
    "/donations/stats",
    {
      schema: {
        response: {
          200: Type.Object({
            totalDonations: Type.Number(),
            totalMoneyDonated: Type.Number(),
            donationsByType: Type.Record(Type.String(), Type.Number()),
            recentDonations: Type.Array(DonationSchema),
          }),
          500: ErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const stats = donationDataService.getStats();
        return stats;
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
}
