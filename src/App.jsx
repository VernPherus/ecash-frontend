<BrowserRouter>
  <Toaster position="top-right" />

  <Routes>
    {/* Auth Routes */}
    <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />

    {/* Protected Routes with Layout */}
    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />

      {/* Management */}
      <Route path="/funds" element={<FundManagerPage />} />
      <Route path="/payees" element={<PayeeManagerPage />} />
      <Route path="/disbursement/new" element={<DisbursementFormPage />} />
      <Route path="/disbursement/edit/:id" element={<DisbursementFormPage />} />
      <Route path="/disbursement/:id" element={<DisbursementViewPage />} />
      <Route path="/disbursement/check" element={<Check />} />
      <Route path="/disbursement/lddap" element={<Lddap />} />

      {/* User */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />

      {/* Admin */}
      <Route path="/admin/users" element={<UserManagerPage />} />
      <Route path="/admin/logs" element={<LogsPage />} />
      <Route path="/admin/signup" element={<SignUpPage />} />
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
