import { useState, useEffect, useRef } from 'react'

export default function Chat() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [thinking, setThinking] = useState(false)
  const ws = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/ws/chat')
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'thinking') {
        setThinking(true)
      } else if (data.type === 'response') {
        setMessages(prev => [...prev, { role: 'ai', text: data.message }])
        setThinking(false)
      }
    }
    return () => ws.current?.close()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!question.trim() || thinking) return
    setMessages(prev => [...prev, { role: 'user', text: question }])
    ws.current.send(JSON.stringify({ message: question }))
    setQuestion('')
    setThinking(true)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-3xl mx-auto px-4 py-6">

      {/* Message history */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <p className="text-center text-f1-faint text-sm mt-20 tracking-widest uppercase">
            Ask anything about the 2026 season
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-f1-red text-white'
                : 'bg-white/5 text-gray-200 border border-white/10'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3">
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-f1-red rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-f1-red rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-f1-red rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about drivers, teams, race predictions..."
          disabled={thinking}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm
            text-white placeholder-gray-500 focus:outline-none focus:border-f1-red
            disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={thinking || !question.trim()}
          className="bg-f1-red hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed
            text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
        >
          {thinking ? '...' : 'Ask'}
        </button>
      </form>
    </div>
  )
}
