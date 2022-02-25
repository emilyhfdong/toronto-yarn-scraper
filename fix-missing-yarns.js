import { getUniqueIds, readLocalJSON } from "./utils.js"
import fs from "fs"

export const fixMissingYarns = async (storeName) => {
  const previousMissingYarns = await readLocalJSON(
    `./data/${storeName}-missing.json`
  )
  const { uniqueIds, missingYarns } = await getUniqueIds(previousMissingYarns)
  console.log(missingYarns)
  if (missingYarns.length) {
    console.log("STILL have", missingYarns.length, "missing yarns")
  } else {
    console.log("No more missing yarns!")
  }
  const existingYarnIds = await readLocalJSON(`./data/${storeName}-ids.json`)
  fs.writeFileSync(
    `./data/${storeName}-missing.json`,
    JSON.stringify(missingYarns)
  )
  const newUnique = new Set([...existingYarnIds, ...uniqueIds])

  fs.writeFileSync(
    `./data/${storeName}-ids.json`,
    JSON.stringify([...newUnique])
  )
}
