/* eslint-disable @next/next/no-img-element */
import React from "react";
import { GetServerSidePropsContext } from "next";
import InterviewItem from "@/components/InterviewItem";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { InferGetServerSidePropsType } from "next";
import NotionServer from "@/lib/NotionServer";

export default function Interview({
  data,
  tags,
  q,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const query = router.query;

  let tagmap: any = {};
  for (const tag of tags) {
    tagmap[tag._id] = tag.tagName;
  }

  const onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      router.push({
        pathname: "/",
        query: {
          ...query,
          q: e.target.value,
          page: 1,
        },
      });
    }
  };

  return (
    <section className="text-neutral-600 dark:text-slate-200 body-font overflow-hidden">
      <div className="container max-w-5xl px-5 py-16 mx-auto">
        <div className="relative">
          <span className="sr-only">Search</span>
          <input
            defaultValue={q}
            onKeyDown={onKeyDown}
            placeholder="搜一搜"
            type="text"
            className="border dark:border-neutral-50/[0.2] focus:outline outline-2 outline-blue-500 rounded  w-full px-12 py-2 pr-3 dark:bg-transparent"
          />
          <svg
            className="w-6 h-6 absolute left-3 top-2 text-neutral-400 dark:text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4 mt-10">
          {tags.map((tag) => {
            return (
              <Link
                key={tag._id}
                href={{
                  pathname: "/",
                  query: {
                    ...query,
                    tagid: tag._id,
                    page: 1,
                  },
                }}
              >
                <a
                  className={clsx(
                    "flex flex-col md:flex-row items-center border dark:border-neutral-50/[0.2] p-2 rounded cursor-pointer",
                    {
                      "border-blue-500 dark:border-blue-500":
                        tag._id === query.tagid,
                    }
                  )}
                >
                  <img
                    src={tag.image}
                    alt={tag.tagName + "ICON"}
                    className="w-10 h-10 md:mr-2"
                  />
                  <span>{tag.tagName}</span>
                </a>
              </Link>
            );
          })}
        </div>
        <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
          {data.map((question) => {
            return (
              <InterviewItem
                tagmap={tagmap}
                key={question._id}
                query={query}
                question={question}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { q = "", tagid, cursor } = context.query;
  const notionServer = new NotionServer();

  const tags = await notionServer.queryTags();

  const { data, has_more } = await notionServer.query({
    title: q as string,
    tagid: tagid as string,
  });

  return {
    props: {
      data,
      tags,
      has_more,
      q,
    }, // will be passed to the page component as props
  };
}
