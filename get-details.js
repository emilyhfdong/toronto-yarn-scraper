import fs from "fs"
import { readLocalJSON } from "./utils.js"
import axios from "axios"
import { KNITTING_STORES } from "./constants.js"

export const getYarnDetails = async () => {
  const romni = readLocalJSON("./data/romni-ids.json")
  const eweKnit = readLocalJSON("./data/eweknit-ids.json")
  const knitomatic = readLocalJSON("./data/knitomatic-ids.json")
  const knittingLoft = readLocalJSON("./data/knitting-loft-ids.json")

  const allYarns = {}

  const addYarnToAllYarns = (id, storeName) => {
    if (allYarns[id]) {
      allYarns[id].stores = [...allYarns[id].stores, storeName]
    } else {
      allYarns[id] = { stores: [storeName] }
    }
  }

  romni.forEach((id) => addYarnToAllYarns(id, KNITTING_STORES.ROMNI))
  eweKnit.forEach((id) => addYarnToAllYarns(id, KNITTING_STORES.EWE_KNIT))
  knitomatic.forEach((id) => addYarnToAllYarns(id, KNITTING_STORES.KNITOMATIC))
  knittingLoft.forEach((id) =>
    addYarnToAllYarns(id, KNITTING_STORES.KNITTING_LOFT)
  )

  const yarnIds = Object.keys(allYarns)
  for (let i = 0; i < yarnIds.length; i++) {
    console.log(i + 1, "/", yarnIds.length)
    const id = yarnIds[i]
    try {
      const response = await axios.get(
        `https://api.ravelry.com/yarns/${id}.json`,
        {
          auth: {
            username: "read-65c7224b6177dfbee93f1e8fcbb20f4c",
            password: "6bNGyn6e+y3bOwlK5iSlXN/8ZKRg4nbc/ASAOLFE",
          },
        }
      )
      const {
        name,
        permalink,
        yarn_company,
        yarn_weight,
        yarn_fibers,
        photos,
      } = response.data.yarn
      const fibers = yarn_fibers.map((fiber) => ({
        percentage: fiber.percentage,
        name: fiber.fiber_type.name,
      }))
      const photo = photos[0]?.square_url
      const link = "https://www.ravelry.com/yarns/library/" + permalink

      allYarns[id] = {
        ...allYarns[id],
        name,
        link,
        company: yarn_company?.name,
        weight: yarn_weight?.name,
        fibers,
        photo,
      }
    } catch (e) {
      console.log("ERROR", e)
    }
  }
  fs.writeFileSync("./data/all-yarn.json", JSON.stringify(allYarns))
}
