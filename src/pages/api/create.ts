import type { NextApiRequest, NextApiResponse } from "next";
import NotionServer from "../../lib/NotionServer";

type Data = any;

const notionServer = new NotionServer();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const data = await notionServer.create(req.body);

  res.status(200).json(data);
}
