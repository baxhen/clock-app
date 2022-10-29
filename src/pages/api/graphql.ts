import { ApolloServer } from "apollo-server-express";
import { NextApiRequest, NextApiResponse } from "next";
import { buildSchema } from "type-graphql";
import { processRequest } from "graphql-upload";
import "reflect-metadata";

import { LocationResolver } from "schema/location";
import { QuoteResolver } from "schema/quotes";

const schema = await buildSchema({
  resolvers: [LocationResolver, QuoteResolver],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  fn: any
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const server = new ApolloServer({
  schema,
  context: (ctx) => ctx,
});

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const contentType = req.headers["content-type"];

  if (contentType && contentType.startsWith("multipart/form-data")) {
    req.body = await processRequest(req, res);
  }
  const apolloMiddleware = server.getMiddleware({
    path: "/api/graphql",
  });

  return runMiddleware(req, res, apolloMiddleware);
}
export default handler;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

// const server = new ApolloServer({
//   schema,
//   cache: "bounded",
//   persistedQueries: false,
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const startServer = server.start();

// const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
//   await startServer;

//   await server.createHandler({ path: "/api/graphql" })(req, res);
// };

// export default handler;
