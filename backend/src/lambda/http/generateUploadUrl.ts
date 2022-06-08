import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { generateAttachmentUrl, updateAttachmentUrl } from '../../helpers'
import { getUserId } from '../utils'
import * as uuid from 'uuid';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    
    const userId = getUserId(event)
    const attachmentId = uuid.v4()
    const uploadUrlString = await generateAttachmentUrl(attachmentId)
    await updateAttachmentUrl(userId,todoId,attachmentId);
    return {
      statusCode: 200,
      body:JSON.stringify({
        uploadUrlString
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
