// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NotionServer from "../../lib/NotionServer";

type Data = any;

const notionServer = new NotionServer();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const title = req.query.start_cursor as string;
  const start_cursor = req.query.start_cursor as string;

  const data = await notionServer.query({ title, start_cursor });

  res.status(200).json(data);
}
