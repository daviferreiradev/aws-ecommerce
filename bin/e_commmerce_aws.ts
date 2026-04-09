#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { ProductsAppStack } from '../lib/productsApps-stack';
import { ECommerceApiStack } from '../lib/ecommerceApi-stack';
import { ProductsAppLayersStack } from '../lib/productsAppLayers-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: "533267126234",
  region: "us-east-1"
}

const tags = {
  cost: "ECommerceAWS",
  team: "daviferreiradev"
}

const productsAppLayersStack = new ProductsAppLayersStack(app, "ProductsAppLayers", {
  env,
  tags
})

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  env,
  tags
})
productsAppStack.addDependency(productsAppLayersStack)

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  env,
  tags,
})
eCommerceApiStack.addDependency(productsAppStack)
