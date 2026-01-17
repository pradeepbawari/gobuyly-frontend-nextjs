export default function ProductPanelLoader() {
  return (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center">
      <div className="space-y-3 w-full mt-7">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 rounded-xl animate-pulse w-full"
          />
        ))}
      </div>
    </div>
  )
}
