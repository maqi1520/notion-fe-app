import type { NextApiRequest, NextApiResponse } from "next";
import NotionServer from "../../lib/NotionServer";

type Data = any;

const notionServer = new NotionServer();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = await notionServer.remove(req.body);

  res.status(200).json(data);
}
