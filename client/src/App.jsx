/*=====================================================

  TODO:

  - polish the style
  - handle empty hobbies and passions
  - confirm required fields & minimum length



=====================================================*/
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Reports from './pages/reports'



function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/reports' element={<Reports />} />
    </Routes>
  )
}

export default App
