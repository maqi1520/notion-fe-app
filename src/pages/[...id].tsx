import React, { useState, useEffect } from "react";
import Head from "next/head";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { getLevelStar } from "@/components/InterviewItem";
import { marked } from "marked";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { Opts } from "@/types";
import NotionServer from "@/lib/NotionServer";

const HighlightCode = dynamic(() => import("@/components/HighlightCode"), {
  ssr: false,
});

export default function InterviewDetail({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const query = router.query;

  const [visible, setVisible] = useState(false);

  const categories = { Choice: "选择题", QA: "问答题" };

  const isChoice = !!data.options;
  const opts: Opts = isChoice ? JSON.parse(data.options || "") : {};
  const options = opts.options;
  const isMulti = opts.isMulti;
  const codes = ["A", "B", "C", "D", "E", "F", "G"];

  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <article className="container max-w-5xl p-5 mx-auto">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 md:text-3xl ">
          {data.title}
        </h1>
        <div className="mt-12 prose max-w-none dark:prose-dark">
          <HighlightCode html={data.desc}></HighlightCode>
          <div className="mt-3 flex justify-between">
            <div>
              <span className="px-3 py-1 bg-blue-500 border border-blue-500  rounded text-white mr-3">
                {categories[data.category]}
              </span>
              <span className="font-semibold">难度：</span>
              <span
                className="text-orange-500 ml-1"
                role={"level:" + data.level}
              >
                {getLevelStar(data.level)}
              </span>
            </div>
          </div>

          {options && (
            <div className="py-2 mt-2">
              <div className="font-medium">
                <span>本题为</span>
                <span>{isMulti ? "多选题" : "单选题"}</span>
              </div>
              <div className="space-y-3 mt-2">
                {options.map((item, index) => (
                  <label className="flex item-center" key={index}>
                    {!isMulti ? (
                      <input
                        className="accent-blue-500"
                        type="radio"
                        value={item}
                        name="checkbox"
                      />
                    ) : (
                      <input
                        className="accent-blue-500"
                        type="checkbox"
                        value={item}
                        name="checkbox"
                      />
                    )}
                    <span className="ml-5">
                      <span className="mr-2 font-semibold">
                        {codes[index]}:
                      </span>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div
            className={clsx(
              "py-10 mt-10 flex justify-center border-t dark:border-neutral-500",
              {
                hidden: visible,
              }
            )}
          >
            <button
              onClick={() => {
                setVisible(true);
              }}
              className="px-6 py-3 border border-blue-500 bg-blue-500  font-semibold text-white rounded mx-auto text-xl"
            >
              查看答案
            </button>
          </div>

          <div className={clsx({ hidden: !visible })}>
            <h2 className="border-b dark:border-neutral-500 p-1">参考答案</h2>
            {opts.answer &&
              opts.answer.map((item: any, index) => (
                <div className="mt-1" key={index}>
                  <span className="mr-5 font-semibold">{codes[item]}:</span>
                  <span>{opts.options[item]}</span>
                </div>
              ))}
            <HighlightCode html={data.explanation}></HighlightCode>
          </div>
        </div>
      </article>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const notionServer = new NotionServer();

  const data = await notionServer.detail(context.params?.id as string);

  return {
    props: {
      data: {
        ...data,
        desc: marked.parse(data.desc || ""),
        explanation: marked.parse(data.explanation || ""),
      },
    },
  };
}
