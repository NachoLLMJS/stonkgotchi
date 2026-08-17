"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");

const CONTRACT="0xcce82f2f546ba50704c8e49594cbd0ee55407777";

test("main entry page exposes the exact official contract address",()=>{
  const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
  assert.match(html,/class="entry-contract"/);
  assert.equal((html.match(new RegExp(CONTRACT,"g"))||[]).length,1);
  assert.match(html,new RegExp(`<code>${CONTRACT}</code>`));
});
