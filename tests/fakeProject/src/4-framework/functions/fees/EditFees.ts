import 'source-map-support/register'
import 'reflect-metadata'
import '@framework/ioc/inversify.config'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { container } from '@shared/ioc/container'
import { middyfy } from '@serverless/common/lib/4-framework/utility/middyfy'
import { httpHandler } from '@serverless/common/lib/4-framework/utility/httpHandler'
import { EditFeesOperator } from '@controller/operations/fees/EditFeesOperator'
import { InputEditFees } from '@controller/serializers/fees/EditFeesSerializer'
import can from '@serverless/common/lib/4-framework/utility/checkPermissionMiddleware'
import { Permissions } from '@framework/utility/permissions'

const main = httpHandler(async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const operator = container.get(EditFeesOperator)
  const input = new InputEditFees(event.body as Object)
  const result = await operator.exec(input)

  return result
})

export const handler = middyfy(main).use(can([Permissions.manageTaxes]))
