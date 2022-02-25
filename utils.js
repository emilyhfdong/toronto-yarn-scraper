import axios from "axios"
import fs from "fs"

const getYarnId = async (yarnName) => {
  const formattedYarnName = yarnName
    .toLowerCase()
    .replace("sale", "")
    .replace("overstock", "")
    .replace("4-ply", " ")
    .replace("-", " ")
    .replace(" alternate dye lots", "")
    .replace(" alternate dye lot", "")
    .replace("clearance", "")
    .replace(/ *\([^)]*\) */g, "")
    .replace("pre order", "")

  try {
    const response = await axios.get(
      "https://api.ravelry.com/yarns/search.json",
      {
        params: {
          query: formattedYarnName,
        },
        auth: {
          username: process.env.RAVELRY_USERNAME,
          password: process.env.RAVELRY_PASSWORD,
        },
      }
    )
    const yarn =
      response.data.yarns.find((yarnInfo) => !yarnInfo.discontinued) ||
      response.data.yarns[0]

    return yarn ? yarn.id : null
  } catch (e) {
    console.log("ERROR finding", formattedYarnName, e.name + ": " + e.message)
    return null
  }
}

export const getUniqueIds = async (yarnNames) => {
  const uniqueIds = new Set()
  const missingYarns = []
  for (let i = 0; i < yarnNames.length; i++) {
    const name = yarnNames[i]
    console.log(i + 1, "/", yarnNames.length)
    const yarnId = await getYarnId(name)
    if (yarnId) {
      uniqueIds.add(yarnId)
    } else {
      missingYarns.push(name)
      console.log("cound not find", name)
    }
  }
  return { uniqueIds, missingYarns }
}

export const readLocalJSON = (filename) => {
  const response = fs.readFileSync(filename)
  return JSON.parse(response)
}
