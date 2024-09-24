// app/loading.js

export default function Loading() {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        <p className="ml-4 text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }
  