import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';

export interface Product {
  id: string;
  code: string;
  productName: string;
  price: number;
  model: string;
}

export class ProductRepository {
  readonly ddbClient: DocumentClient;
  readonly productsDdb: string;

  constructor(ddbClient: DocumentClient, productsDdb: string) {
    this.ddbClient = ddbClient;
    this.productsDdb = productsDdb;
  }

  async getAll(): Promise<Product[]> {
    const data = await this.ddbClient.scan({
      TableName: this.productsDdb
    }).promise()
    return data.Items as Product[]
  }

  async getById(productId: string): Promise<Product> {
    const data = await this.ddbClient.get({
      TableName: this.productsDdb,
      Key: {
        id: productId
      }
    }).promise()

    if (data.Item) {
      return data.Item as Product
    } else {
      throw new Error(`Product with id ${productId} not found`)
    }
  }

  async create(product: Product): Promise<Product> {
    product.id = uuid()
    await this.ddbClient.put({
      TableName: this.productsDdb,
      Item: product
    }).promise()
    return product
  }

  async delete(productId: string): Promise<Product> {
    const data = await this.ddbClient.delete({
      TableName: this.productsDdb,
      Key: {
        id: productId
      },
      ReturnValues: 'ALL_OLD'
    }).promise()
    if (data.Attributes) {
      return data.Attributes as Product
    } else {
      throw new Error(`Product with id ${productId} not found`)
    }
  }
  
  async update(productId: string, product: Product): Promise<Product> {
    const data = await this.ddbClient.update({
      TableName: this.productsDdb,
      Key: {
        id: productId
      },
      ConditionExpression: 'attribute_exists(id)',
      ReturnValues: 'UPDATED_NEW',
      UpdateExpression: 'set code = :code, productName = :productName, price = :price, model = :model',
      ExpressionAttributeValues: {
        ':code': product.code,
        ':productName': product.productName,
        ':price': product.price,
        ':model': product.model
      }
    }).promise()
    data.Attributes!.id = productId
    return data.Attributes as Product
  }
}
