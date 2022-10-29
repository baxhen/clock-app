import { ApolloServer } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse } from "next";
import "reflect-metadata";

import { LocationResolver } from "schema/location";
import { QuoteResolver } from "schema/quotes";

import { buildSchema } from "type-graphql";

const schema = await buildSchema({
  resolvers: [LocationResolver, QuoteResolver],
});

const server = new ApolloServer({
  schema,

  introspection: true,
  context(ctx) {
    return ctx;
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = server.createHandler({ path: "/api/graphql" });

export default handler;
