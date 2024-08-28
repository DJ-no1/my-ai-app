'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TicketBookingClientProps {
  adultPrice: number;
  childPrice: number;
  seniorPrice: number;
}

export function TicketBookingClient({ adultPrice, childPrice, seniorPrice }: TicketBookingClientProps) {
  const [adultCount, setAdultCount] = useState(0)
  const [childCount, setChildCount] = useState(0)
  const [seniorCount, setSeniorCount] = useState(0)

  const total = adultCount * adultPrice + childCount * childPrice + seniorCount * seniorPrice

  const handlePayment = () => {
    alert(`Payment processed for $${total.toFixed(2)}. Thank you for your purchase!`)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="adult-tickets">Adult Tickets (${adultPrice})</Label>
        <Input
          id="adult-tickets"
          type="number"
          min="0"
          value={adultCount}
          onChange={(e) => setAdultCount(Math.max(0, parseInt(e.target.value) || 0))}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="child-tickets">Child Tickets (${childPrice})</Label>
        <Input
          id="child-tickets"
          type="number"
          min="0"
          value={childCount}
          onChange={(e) => setChildCount(Math.max(0, parseInt(e.target.value) || 0))}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="senior-tickets">Senior Tickets (${seniorPrice})</Label>
        <Input
          id="senior-tickets"
          type="number"
          min="0"
          value={seniorCount}
          onChange={(e) => setSeniorCount(Math.max(0, parseInt(e.target.value) || 0))}
          className="mt-1"
        />
      </div>
      <div className="mt-6">
        <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
      </div>
      <Button 
        onClick={handlePayment} 
        className="w-full"
        disabled={total === 0}
      >
        Make Payment
      </Button>
    </div>
  )
}