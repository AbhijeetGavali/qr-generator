export default function ConfirmModal({ open, onConfirm, onCancel }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded">
        <h3 className="font-semibold">This cannot be undone</h3>
        <div className="mt-4 flex gap-2">
          <button onClick={onCancel}>Cancel</button>
          <button className="bg-red-500 text-white" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
