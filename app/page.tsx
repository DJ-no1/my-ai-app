'use client'

import { useState } from 'react'
import { Message, continueConversation } from './actions'

export default function Home() {
  const [conversation, setConversation] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Wonderland Zoo Chat</h1>
      <div className="mb-4 h-[400px] overflow-y-auto border rounded p-2">
        {conversation.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-red' : 'bg-blue-700'}`}>
              <p>{message.content}</p>
            </div>
            {message.display && <div className="mt-2 text-red-700">{message.display}</div>}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="flex-grow p-2 border rounded-l text-black"
          placeholder="Ask about our zoo..."
        />
        <button
          onClick={async () => {
            const userMessage = { role: 'user' as const, content: input }
            setConversation([...conversation, userMessage])
            setInput('')
            const { messages } = await continueConversation([
              ...conversation.map(({ role, content }) => ({ role, content })),
              userMessage,
            ])
            setConversation(messages)
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  )
}