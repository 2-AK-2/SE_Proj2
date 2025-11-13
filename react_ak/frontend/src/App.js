<Routes>

  {/* First screen */}
  <Route path="/" element={<RoleSelect />} />

  {/* Role choice */}
  <Route path="/choose-rider" element={<ChooseRider />} />
  <Route path="/choose-driver" element={<ChooseDriver />} />

  {/* Rider routes */}
  <Route path="/signup" element={<RiderSignup />} />
  <Route path="/login" element={<Login />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <FareEstimator />
      </ProtectedRoute>
    }
  />

  {/* Driver routes */}
  <Route path="/driver/login" element={<DriverLogin />} />
  <Route path="/driver/register" element={<DriverRegister />} />

  <Route
    path="/driver/notifications"
    element={
      <ProtectedRoute>
        <RideNotifications />
      </ProtectedRoute>
    }
  />

  <Route
    path="/driver/rate"
    element={
      <ProtectedRoute>
        <RateRider />
      </ProtectedRoute>
    }
  />

</Routes>
