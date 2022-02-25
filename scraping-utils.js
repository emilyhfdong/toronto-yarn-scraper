import { KNITTING_STORES } from "./constants"

const getYarnsFromRomni = async () => {
  console.log("launching browser")
  const browser = await puppeteer.launch({ headless: true })
  console.log("going to romni")
  const page = await browser.newPage()
  await page.goto(
    "https://www.romniwools.ca/collections/yarn-catalogue-at-romni-wools?page=1"
  )
  console.log("getting yarns")
  let pageNumber = 1
  const totalPages = await page.$eval(".pagination__text", (node) =>
    Number(node.innerText.split(" ").slice(-1)[0])
  )
  const yarns = []
  while (pageNumber <= totalPages) {
    console.log("page: ", pageNumber)
    const pageYarns = await page.$$eval(".product-card__title", (nodes) =>
      nodes.map((n) => n.innerText)
    )
    console.log(yarns.length)
    yarns.push(...pageYarns)
    pageNumber += 1
    await page.goto(
      `https://www.romniwools.ca/collections/yarn-catalogue-at-romni-wools?page=${pageNumber}`
    )
  }
  await browser.close()
  fs.writeFileSync("./data/romni-names.json", JSON.stringify(yarns))
  return yarns
}

const getYarnsFromEweKnit = async () => {
  console.log("launching browser")
  const browser = await puppeteer.launch({ headless: true })
  console.log("going to eweknit")
  const page = await browser.newPage()
  await page.goto("https://eweknit.co/collections/yarn?page=1")
  console.log("getting yarns")
  let pageNumber = 1
  const totalPages = 5
  const yarns = []
  while (pageNumber <= totalPages) {
    console.log("page: ", pageNumber)
    const pageYarns = await page.$$eval(".coll-prod-title", (nodes) =>
      nodes.map((n) => n.innerText)
    )
    console.log(yarns.length)
    yarns.push(...pageYarns)
    pageNumber += 1
    await page.goto(`https://eweknit.co/collections/yarn?page=${pageNumber}`)
  }
  await browser.close()
  fs.writeFileSync("./data/eweknit-names.json", JSON.stringify(yarns))
  return yarns
}

const getYarnsFromKnitOMatic = async () => {
  console.log("launching browser")
  const browser = await puppeteer.launch({ headless: true })
  console.log("going to knit-o-matic")
  const page = await browser.newPage()
  await page.goto("https://knitomatic.com/collections/yarn")
  console.log("getting yarns")
  let pageNumber = 1
  const totalPages = 2
  const yarns = []
  while (pageNumber <= totalPages) {
    console.log("page: ", pageNumber)
    const pageYarns = await page.$$eval(".details .title", (nodes) =>
      nodes.map((n) => n.innerText)
    )
    console.log(yarns.length)
    yarns.push(...pageYarns)
    pageNumber += 1
    await page.goto(
      `https://knitomatic.com/collections/yarn?page=${pageNumber}`
    )
  }
  await browser.close()
  fs.writeFileSync("./data/knitomatic-names.json", JSON.stringify(yarns))
  return yarns
}

const getYarnsFromKnittingLoft = async () => {
  console.log("launching browser")
  const browser = await puppeteer.launch({ headless: true })
  console.log("going to knitting loft")
  const page = await browser.newPage()
  await page.goto(`file://${__dirname}/knitting-loft.html`)
  console.log("getting yarns")

  const yarns = await page.$$eval(".product-details h3", (nodes) =>
    nodes.map((n) => n.innerText)
  )
  await browser.close()
  fs.writeFileSync("./data/knitting-loft-names.json", JSON.stringify(yarns))
  return yarns
}

export const yarnStoreToScrapingFn = {
  [KNITTING_STORES.ROMNI]: getYarnsFromRomni,
  [KNITTING_STORES.EWE_KNIT]: getYarnsFromEweKnit,
  [KNITTING_STORES.KNITOMATIC]: getYarnsFromKnitOMatic,
  [KNITTING_STORES.KNITTING_LOFT]: getYarnsFromKnittingLoft,
}
