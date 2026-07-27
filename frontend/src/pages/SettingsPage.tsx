function SettingsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Settings</h2>
      <div className="rounded border bg-white p-4 dark:bg-slate-900 dark:border-slate-700">
        <p className="text-sm text-slate-500">Use environment variable VITE_API_BASE_URL to configure backend API URL.</p>
      </div>
    </div>
  );
}

export default SettingsPage;
