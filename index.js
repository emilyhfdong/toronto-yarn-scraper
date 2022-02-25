import { KNITTING_STORES } from "./constants"
import { fixMissingYarns } from "./fix-missing-yarns"
import { getYarnDetails } from "./get-details"
import { getYarnsFromStore } from "./get-yarns-from-stores"
import { uploadYarnsToNotion } from "./upload-to-notion"

/*
  run each step at a time by commenting out other steps 
*/
;(async () => {
  // step 1: get scrape all yarns from stores
  await getYarnsFromStore(KNITTING_STORES.ROMNI)
  await getYarnsFromStore(KNITTING_STORES.EWE_KNIT)
  await getYarnsFromStore(KNITTING_STORES.KNITTING_LOFT)
  await getYarnsFromStore(KNITTING_STORES.KNITOMATIC)

  // step 2: manually fix missing.json files and uncomment below until there are no more missing
  await fixMissingYarns(KNITTING_STORES.ROMNI)
  await fixMissingYarns(KNITTING_STORES.EWE_KNIT)
  await fixMissingYarns(KNITTING_STORES.KNITTING_LOFT)
  await fixMissingYarns(KNITTING_STORES.KNITOMATIC)

  // step 3: get yarn details from ravelry
  await getYarnDetails()

  // step 4: upload yarns to notion
  await uploadYarnsToNotion()
})()
