import { getZooInfo } from '@/utils/zoo-data'
import { SkeletonCard } from './Form'

export function TicketBooking() {
  const zooInfo = getZooInfo()

  return (
    <div className="mt-4 p-6 border rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Book Tickets</h2>
     <SkeletonCard />
      <div className="mt-4 p-3 bg-blue-100 rounded-md">
        <p className="text-blue-800 font-semibold">Note: Online bookings receive a 10% discount!</p>
      </div>
    </div>
  )
}