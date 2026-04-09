import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent,
  context: Context): Promise<APIGatewayProxyResult> {

  const lambdRequestId = context.awsRequestId
  const apiRequestId = event.requestContext.requestId

  console.log(`API Gateway Request ID: ${apiRequestId}, Lambda Request ID: ${lambdRequestId}`)
  
  const method = event.httpMethod
  if (event.resource === "/products") {
    if (method === 'POST') {
      console.log('POST /products')
      return {
        statusCode: 201,
        body: JSON.stringify({
          message: "POST /products - OK"
        })
      }
    }
  } else if (event.resource === "/products/{id}") {
    const productId = event.pathParameters?.id as string
    if (method === 'PUT') {
      console.log(`PUT /products/${productId}`)
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `PUT /products/${productId} - OK`
        })
      }
    } else if (method === 'DELETE') {
      console.log(`DELETE /products/${productId}`)
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `DELETE /products/${productId} - OK`
        })
      }
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Bad request"
    })
  }
}