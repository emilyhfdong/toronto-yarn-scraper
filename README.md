# 🧶 toronto-yarn-scraper

https://emilydong.notion.site/yarns-d57d32c9fc4c40bd95de53a6f69cf21a

## Description

Simple tool that creates a notion table that shows which yarns available at popular Toronto yarn stores (Eweknit, Knitting Loft, Romni Wools, Knit-o-matic)

Built with **NodeJS, Puppeteer, Notion API, and Ravelry API**.

## Setup instructions

### Notion page

Create a Notion page for the new Table to be created in.

### Environment variables

Create a `.env` file with the following variables:

- `NOTION_API_TOKEN`: Notion's integration token
- `NOTION_PARENT_PAGE_ID`: the `page_id` of the page that the table will be created in
- `RAVELRY_USERNAME`: username from your Ravelry app credentials
- `RAVELRY_PASSWORD`: password from your Ravelry app credentials

### Installation

```
npm install
```

### Usage

```
npm start
```

Follow instructions in `/index.js` file

## How it works

1. Using Puppeteer, goes to the popular yarn stores and grabs all the available yarn names.
2. Yarn names are put through the Ravelry API search endpoint to find the corresponding ids. Ids are stores in JSON files for each store with the name `data/<store_name>-ids.json`. Yarns that could not be found (eg. due to spelling mistakes) will be stores in a JSON file with the name `data/<store_name>-missing.json`
3. User/Dev can have to go to the missing yarn JSON files to manually fix spelling
4. Yarn ids for each store are combined into a single JSON and additional info (name, company, weight, etc) is added using the Ravelry API
5. Notion table is created and all yarn data is uploaded to the created table

## Improvements

- Function to clean yarn name before using the Ravelry API search endpoint so that there are less missing yarns
- Currently the workflow involves User/Dev to uncomment/comment out steps in the `index.js` file. This can be improved.
