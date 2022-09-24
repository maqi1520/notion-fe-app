// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NotionServer from "../../lib/NotionServer";

type Data = any;

const notionServer = new NotionServer();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = await notionServer.detail(
    "fcc50568-8eda-40e5-99ee-dddce82d92ae"
  );

  res.status(200).json(data);
}
