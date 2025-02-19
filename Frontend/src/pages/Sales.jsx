import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

function Sales() {
  const salesData = [
    { date: "1 Jan", sales: 3200 },
    { date: "2 Jan", sales: 2400 },
    { date: "3 Jan", sales: 2800 },
    { date: "4 Jan", sales: 3600 },
    { date: "5 Jan", sales: 4000 },
  ]

  return (
    <div className="sales">
      <div className="header">
        <h1>Sales Overview</h1>
      </div>

      <div className="sales-stats">
        <div className="stat-card">
          <h3>Today's Sales</h3>
          <div className="amount">Rs. 12,450</div>
          <div className="trend">+15% from yesterday</div>
        </div>

        <div className="stat-card">
          <h3>Weekly Sales</h3>
          <div className="amount">Rs. 85,240</div>
          <div className="trend">+8% from last week</div>
        </div>

        <div className="stat-card">
          <h3>Monthly Sales</h3>
          <div className="amount">Rs. 345,670</div>
          <div className="trend">+12% from last month</div>
        </div>
      </div>

      <div className="chart-section">
        <h2>Sales Trend</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Sales

