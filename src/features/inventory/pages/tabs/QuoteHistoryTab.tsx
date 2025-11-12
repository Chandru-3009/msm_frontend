export default function QuoteHistoryTab() {
  return (
    <div className="card" style={{ padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Quote History</h3>
      <div className="small">Coming soon. Placeholder table.</div>
      <table className="table" style={{ marginTop: 8 }}>
        <thead>
          <tr><th>Date</th><th>Customer</th><th>Quantity</th><th>Quoted Price</th></tr>
        </thead>
        <tbody>
          <tr><td colSpan={4} className="small" style={{ padding: 12 }}>No data</td></tr>
        </tbody>
      </table>
    </div>
  )
}


