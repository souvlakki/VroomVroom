function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">VroomVroom</h1>
          <p className="text-sm text-slate-600">
            Parent and child carpool management app
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-2">Frontend is running</h2>
          <p className="text-slate-600">
            This is the basic VroomVroom starter screen. Authentication, GPS,
            messaging, and database features will be added later.
          </p>
        </section>

        <nav className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold">Events</h3>
            <p className="text-sm text-slate-600">View team events and rides.</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold">Transportation</h3>
            <p className="text-sm text-slate-600">
              Manage ride offers and requests.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold">GPS</h3>
            <p className="text-sm text-slate-600">
              Driver location sharing will be added later.
            </p>
          </div>
        </nav>
      </main>
    </div>
  )
}

export default App