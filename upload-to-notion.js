import { readLocalJSON } from "./utils.js"
import { Client } from "@notionhq/client"

export const uploadYarnsToNotion = async () => {
  const notion = new Client({
    auth: process.env.NOTION_API_TOKEN,
  })

  const searchResponse = await notion.search()
  const existingDB = searchResponse.results.find(
    (result) => result.object === "database"
  )
  if (existingDB) {
    console.log("deleting previous db")
    await notion.blocks.delete({
      block_id: existingDB.id,
    })
  }
  console.log("creating table")
  const database = await notion.databases.create({
    parent: {
      type: "page_id",
      page_id: process.env.NOTION_PARENT_PAGE_ID,
    },
    title: [{ text: { content: "catalogue" } }],
    properties: {
      name: { type: "title", title: {} },
      company: { type: "select", select: {} },
      stores: { type: "multi_select", multi_select: {} },
      weight: { type: "select", select: {} },
      fibers: { type: "multi_select", multi_select: {} },
      ravelry: { type: "url", url: {} },
    },
  })

  const yarnMap = readLocalJSON("./data/all-yarn.json")
  const yarns = Object.values(yarnMap)
  for (let i = 0; i < yarns.length; i++) {
    const { stores, name, company, link, fibers, weight } = yarns[i]
    console.log(i + 1, "/", yarns.length)

    await notion.pages.create({
      parent: { database_id: database.id },
      properties: {
        name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        company: {
          select: {
            name: company,
          },
        },
        ...(weight && {
          weight: {
            select: {
              name: weight,
            },
          },
        }),
        stores: {
          multi_select: stores.map((store) => ({
            name: store.toLowerCase().replaceAll("_", " "),
          })),
        },
        ravelry: {
          url: link,
        },
        fibers: {
          multi_select: fibers.map((fiber) => ({ name: fiber.name })),
        },
      },
    })
  }
}
