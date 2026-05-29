import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import ResetPassword from './pages/ResetPassword'
import Confirm from './pages/Confirm'

const AppShell = styled.div`
  min-height: 100vh;
  background: #f1f5f9;
`

function App() {
  return (
    <AppShell>
      <BrowserRouter>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/confirm" element={<Confirm />} />
        </Routes>
      </BrowserRouter>
    </AppShell>
  )
}

export default App
