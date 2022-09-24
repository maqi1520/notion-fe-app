const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

(async () => {
  const content = fs.readFileSync(
    path.resolve(__dirname, "./femap.json"),
    "utf8"
  );

  const tags = [
    {
      _id: "6b428f57-0831-4280-ac1c-8d016c8d038b",
      id: 17,
      image: "/static/logo/fun.svg",
      tagName: "趣味题",
    },
    {
      _id: "daee525b-aa1c-4027-891a-385afb4cc1d0",
      id: 32,
      image: "/static/logo/choose.svg",
      tagName: "选择题",
    },
    {
      _id: "dd750f78-1c0e-4f6e-84e8-7adad2f2c57d",
      id: 26,
      image: "/static/logo/code.svg",
      tagName: "编程题",
    },
    {
      _id: "6e9070e6-b5c4-4338-8c44-d3c4b714cf85",
      id: 31,
      image: "/static/logo/leetcode.svg",
      tagName: "leetcode",
    },
    {
      _id: "b6de78c0-e4be-4008-84bf-d85e87a95d9d",
      id: 30,
      image: "/static/logo/computer.svg",
      tagName: "计算机基础",
    },
    {
      _id: "dfd76014-4212-4386-b4f4-86defc7598d3",
      id: 27,
      image: "/static/logo/palette.svg",
      tagName: "设计模式",
    },
    {
      _id: "ac36bd7a-07a3-4bec-b4a8-809cdb83aa00",
      id: 23,
      image: "/static/logo/weixin.svg",
      tagName: "小程序",
    },
    {
      _id: "e826a3cc-1b75-408b-9900-7f7c7bca511f",
      id: 21,
      image: "/static/logo/safe.svg",
      tagName: "前端安全",
    },
    {
      _id: "85b45277-e849-4352-8035-6283d0e3e797",
      id: 20,
      image: "/static/logo/youhua.svg",
      tagName: "性能优化",
    },
    {
      _id: "99c2c86b-3327-4351-aace-83e60207a7a4",
      id: 19,
      image: "/static/logo/ts.svg",
      tagName: "Typescript",
    },
    {
      _id: "49f63f1d-d6a7-40b1-83c8-da8b861f3ad5",
      id: 29,
      image: "/static/logo/tools.svg",
      tagName: "工具",
    },
    {
      _id: "b0c09b0f-51cd-435d-8b41-7076963007e7",
      id: 28,
      image: "/static/logo/webpack.svg",
      tagName: "工程化",
    },
    {
      _id: "2b1ceff5-63d3-4d8b-9455-dad41ce9a77b",
      id: 18,
      image: "/static/logo/node.svg",
      tagName: "Node.js",
    },
    {
      _id: "e7e27296-cde9-4a5b-962f-365fcf2d13f3",
      id: 14,
      image: "/static/logo/vue.svg",
      tagName: "Vue.js",
    },
    {
      _id: "7ef8164b-ddb8-421c-b384-71b197361d8e",
      id: 13,
      image: "/static/logo/react.svg",
      tagName: "React.js",
    },
    {
      _id: "b161bd6e-6b22-4caf-85f8-6e1ccac2928f",
      id: 12,
      image: "/static/logo/html.svg",
      tagName: "HTML",
    },
    {
      _id: "1f68d068-62a6-454d-a8e6-812536a1033a",
      id: 11,
      image: "/static/logo/css.svg",
      tagName: "CSS",
    },
    {
      _id: "9192baa6-4e65-4c5d-b6bf-361ccca625b2",
      id: 10,
      image: "/static/logo/js.svg",
      tagName: "JavaScript",
    },
  ];

  const data = content.split("\n");

  for (let index = 0; index < data.length; index++) {
    if (data[index].trim() === "") continue;
    let item = JSON.parse(data[index]);
    item.tag = tags.find((tag) => tag.id === item.tagId)?._id;

    const res = await fetch("http://localhost:3000/api/tag", {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(item),
    }).then((res) => res.json());

    console.log("第" + index + "题" + item.title + res.id);
  }
  console.log("end");
})();
