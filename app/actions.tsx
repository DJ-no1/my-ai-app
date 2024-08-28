'use server'

import { generateText } from 'ai'
import { createStreamableUI } from 'ai/rsc'
import { ReactNode } from 'react'
import { z } from 'zod'
import { getZooInfo } from '@/utils/zoo-data'
import { googleModel } from '@/utils/google-ai'
import { TicketBooking } from './components/TicketBooking'
import {google} from '@ai-sdk/google'
export interface Message {
  role: 'user' | 'assistant'
  content: string
  display?: ReactNode
}

export async function continueConversation(history: Message[]) {
  const stream = createStreamableUI()
  const zooInfo = getZooInfo()

  const { text, toolResults } = await generateText({
    model: google('gemini-1.5-pro'),
    system: `You are a friendly assistant for ${zooInfo.name}. Here's some information about the zoo:
    - Location: ${zooInfo.location}
    - Opening Hours: ${zooInfo.openingHours}
    - Animals: ${zooInfo.animals.map(animal => animal.name).join(', ')}
    - Attractions: ${zooInfo.attractions.join(', ')}
    Only answer questions related to this zoo. If asked about anything else, politely redirect the conversation to zoo-related topics.`,
    messages: history,
    tools: {
      showWeather: {
        description: 'Show the weather for the zoo location.',
        parameters: z.object({
          date: z.string().describe('The date to show the weather for (YYYY-MM-DD).'),
        }),
        execute: async ({ date }) => {
          // Simulated weather data
          const weather = {
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
            condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
          }
          stream.done(
            <div className="mt-4 p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Weather Forecast</h2>
              <p>Date: {date}</p>
              <p>Temperature: {weather.temperature}°F</p>
              <p>Condition: {weather.condition}</p>
            </div>
          )
          return `Here's the weather forecast for ${zooInfo.name} on ${date}!`
        },
      },
      showTicketBooking: {
        description: 'Show the ticket booking interface.',
        parameters: z.object({
          showReason: z.string().optional().describe('Optional reason for showing the ticket booking interface.'),
        }),
        execute: async ({ showReason }) => {
          stream.done(<TicketBooking />)
          return `Here's the ticket booking interface for ${zooInfo.name}.${showReason ? ` Reason: ${showReason}` : ''} You can select the number of tickets and make a payment.`
        },
      },
    },
  })

  return {
    messages: [
      ...history,
      {
        role: 'assistant' as const,
        content: text || toolResults.map(toolResult => toolResult.result).join(),
        display: stream.value,
      },
    ],
  }
}