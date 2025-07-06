export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        <h2 className="text-xl font-semibold">Loading AR Preview...</h2>
        <p className="text-purple-300">Preparing your augmented reality experience</p>
      </div>
    </div>
  )
}
