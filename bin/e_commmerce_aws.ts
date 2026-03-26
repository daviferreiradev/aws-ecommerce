#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { ProductsAppStack } from '../lib/productsApps-stack';
import { ECommerceApiStack } from '../lib/ecommerceApi-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: "533267126234",
  region: "us-east-1"
}

const tags = {
  cost: "ECommerceAWS",
  team: "daviferreiradev"
}

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  env,
  tags
})

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  env,
  tags,
})
eCommerceApiStack.addDependency(productsAppStack)
