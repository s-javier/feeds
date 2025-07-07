import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  // @ts-ignore
  apiKey: process.env.ANTHROPIC_API_KEY,
})
