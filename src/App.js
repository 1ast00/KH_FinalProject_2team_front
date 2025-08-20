import logo from './logo.svg';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
    <Header />
    <Footer />
    <div>
      <Routes>
        <Route></Route>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
