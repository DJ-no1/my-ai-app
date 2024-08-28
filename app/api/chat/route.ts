import { GoogleGenerativeAIStream, StreamingTextResponse, Message } from 'ai';
import { getZooInfo } from '@/utils/zoo-data';
import { z } from 'zod';
import { generateText, tool } from 'ai';
import { googleModel } from '@/utils/google-ai'

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const zooInfo = getZooInfo();

  const zooContext = `
    You are an AI assistant for ${zooInfo.name}. Here's some information about the zoo:
    - Location: ${zooInfo.location}
    - Opening Hours: ${zooInfo.openingHours}
    - Ticket Prices: Adult $${zooInfo.ticketPrices.adult}, Child $${zooInfo.ticketPrices.child}, Senior $${zooInfo.ticketPrices.senior}
    - Animals: ${zooInfo.animals.map(animal => animal.name).join(', ')}
    - Attractions: ${zooInfo.attractions.join(', ')}

    Only answer questions related to this zoo. If asked about anything else, politely redirect the conversation to zoo-related topics.
  `;

  const result = await generateText({
    model: googleModel,
    messages: [
      { role: 'system', content: zooContext },
      ...messages.map((m: Message) => ({
        role: m.role,
        content: m.content,
      })),
    ],
    tools: {
      getWeather: tool({
        description: 'Get the current weather at the zoo',
        parameters: z.object({
          date: z.string().describe('The date to get the weather for (YYYY-MM-DD)'),
        }),
        execute: async ({ date }) => {
          // Simulated weather data
          const weather = {
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
            condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
          };
          return `On ${date}, the weather at ${zooInfo.name} is ${weather.condition} with a temperature of ${weather.temperature}°F.`;
        },
      }),
      bookTickets: tool({
        description: 'Book tickets for the zoo',
        parameters: z.object({
          adultCount: z.number().int().min(0).describe('Number of adult tickets'),
          childCount: z.number().int().min(0).describe('Number of child tickets'),
          seniorCount: z.number().int().min(0).describe('Number of senior tickets'),
        }),
        execute: async ({ adultCount, childCount, seniorCount }) => {
          const total = 
            adultCount * zooInfo.ticketPrices.adult +
            childCount * zooInfo.ticketPrices.child +
            seniorCount * zooInfo.ticketPrices.senior;
          return `Booking confirmed! Total price: $${total}. Enjoy your visit to ${zooInfo.name}!`;
        },
      }),
    },
    maxToolRoundtrips: 3,
  });

  const stream = GoogleGenerativeAIStream(result);
  return new StreamingTextResponse(stream);
}