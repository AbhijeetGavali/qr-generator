export default function QRTable({ data, onEdit, onDelete }: any) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th>Name</th>
          <th>Created</th>
          <th>Scans</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {data.map((qr: any) => (
          <tr key={qr.id} className="border-b">
            <td>{qr.name}</td>
            <td>{qr.createdAt?.toDate().toLocaleDateString()}</td>
            <td>{qr.scanCount}</td>
            <td className="flex gap-2">
              <button onClick={() => onEdit(qr)}>Edit</button>
              <button onClick={() => onDelete(qr)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
