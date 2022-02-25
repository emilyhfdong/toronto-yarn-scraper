import { getUniqueIds } from "./utils.js"
import fs from "fs"
import { yarnStoreToScrapingFn } from "./scraping-utils"

export const getYarnsFromStore = async (storeName) => {
  console.log("getting yarn from", storeName)
  const yarns = await yarnStoreToScrapingFn[storeName]()
  const { uniqueIds, missingYarns } = await getUniqueIds(yarns)

  console.log("writing ids", uniqueIds.size)
  fs.writeFileSync(
    `./data/${storeName}-ids.json`,
    JSON.stringify([...uniqueIds])
  )
  console.log("missing", missingYarns.length, "yarns")
  fs.writeFileSync(
    `./data/${storeName}-missing.json`,
    JSON.stringify(missingYarns)
  )
}
