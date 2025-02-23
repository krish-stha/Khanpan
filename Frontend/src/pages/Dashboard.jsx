import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"


function Dashboard() {
  const data = [
    { month: "Jan", amount: 800 },
    { month: "Feb", amount: 1600 },
    { month: "Mar", amount: 1400 },
    { month: "Apr", amount: 2000 },
    { month: "May", amount: 2400 },
  ]

  return (
    <div className="dashboard">
      <h1>Khanpan Restaurant</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="amount">Rs. 45,231</div>
          <div className="trend">+20.1% from last month</div>
        </div>

        <div className="stat-card">
          <h3>Orders</h3>
          <div className="amount">+573</div>
          <div className="trend">+201 since last hour</div>
        </div>

        <div className="stat-card">
          <h3>Active Tables</h3>
          <div className="amount">12</div>
          <div className="trend">+2 since last hour</div>
        </div>

        <div className="stat-card">
          <h3>Popular Items</h3>
          <div className="amount">Chatamari</div>
          <div className="trend">48 orders today</div>
        </div>
      </div>

      <div className="chart-section">
        <h2>Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Bar dataKey="amount" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Dashboard

