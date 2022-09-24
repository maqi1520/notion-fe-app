import { Client } from "@notionhq/client";
import { Question, Tag } from "@/types";
const auth = process.env.NOTION_ACCESS_TOKEN;

type Text = "text";
interface PropsText {
  type: Text;
  text: {
    content: string;
  };
}

function strToArray(
  str: string = "",
  count: number,
  arr: PropsText[]
): PropsText[] {
  arr.push({
    type: "text",
    text: {
      content: str.slice(0, count),
    },
  });
  str = str.slice(count);
  if (str.length >= count) {
    return strToArray(str, count, arr);
  } else {
    return arr;
  }
}

interface QueryParams {
  id?: string;
  start_cursor?: string;
  title?: string;
  tagid?: string;
}

type QueryResult = {
  next_cursor: string | null;
  has_more: boolean;
  data: Question[];
};

export default class NotionService {
  client: Client;

  constructor() {
    this.client = new Client({ auth });
  }

  async queryTags(): Promise<Tag[]> {
    const database = process.env.NOTION_DATABASE_TAG_ID ?? "";
    const response = await this.client.databases.query({
      database_id: database,
    });

    return response.results.map((item) => NotionService.transformer(item));
  }

  async detail(id: string): Promise<Question> {
    const response = await this.client.pages.retrieve({
      page_id: id,
    });

    return NotionService.transformer(response);
  }

  async query({
    start_cursor,
    title = "",
    tagid,
  }: QueryParams): Promise<QueryResult> {
    const database = process.env.NOTION_DATABASE_QUESTION_ID ?? "";
    const and: any = [
      tagid && {
        property: "tag",
        relation: {
          contains: tagid,
        },
      },
      {
        property: "title",
        title: {
          contains: title,
        },
      },
    ].filter(Boolean);
    const response = await this.client.databases.query({
      database_id: database,
      page_size: 20,
      start_cursor,
      filter: {
        and,
      },
    });

    const data = response.results.map((item) =>
      NotionService.transformer(item)
    );

    return {
      next_cursor: response.next_cursor,
      has_more: response.has_more,
      data,
    };
  }

  async create(question: Question): Promise<any> {
    const database = process.env.NOTION_DATABASE_QUESTION_ID ?? "";
    const properties: any = {
      desc: {
        type: "rich_text",
        rich_text: strToArray(question.desc ?? "", 2000, []),
      },
      category: {
        type: "select",
        select: {
          name: question.category,
        },
      },
      options: {
        type: "rich_text",
        rich_text: strToArray(question.options ?? "", 2000, []),
      },
      explanation: {
        type: "rich_text",
        rich_text: strToArray(question.explanation ?? "", 2000, []),
      },
      title: {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: question.title ?? "",
            },
          },
        ],
      },
    };

    if (question.tag) {
      properties.tag = {
        type: "relation",
        relation: [
          {
            id: question.tag,
          },
        ],
      };
    }
    const response = await this.client.pages.create({
      parent: {
        database_id: database,
      },
      properties,
    });
    return response;
  }

  async remove(pageId: string) {
    const response = await this.client.pages.update({
      page_id: pageId,
      properties: {
        "In stock": {
          checkbox: true,
        },
      },
    });
    return response;
  }

  private static transformer(page: any) {
    let data: any = {
      _id: page.id,
    };

    for (const key in page.properties) {
      if (
        !page.properties[key] ||
        !page.properties[key][page.properties[key].type]
      ) {
        continue;
      }
      switch (page.properties[key].type) {
        case "relation":
          if (page.properties[key].relation[0])
            data[key] = page.properties[key].relation[0]?.id;
          break;

        case "number":
          data[key] = page.properties[key].number;
          break;

        case "select":
          if (page.properties[key].select)
            data[key] = page.properties[key].select?.name;
          break;

        case "title":
        case "rich_text":
          if (page.properties[key][page.properties[key].type][0]) {
            data[key] = page.properties[key][page.properties[key].type]
              .map((item: PropsText) => item.text.content)
              .join("");
          }
          break;

        default:
          data[key] = page.properties[key] || null;
          break;
      }
    }

    return data;
  }
}
