import "./App.css";
/** @jsxImportSource @emotion/react */

import { Container } from "react-bootstrap";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AnimeListPage from "./pages/animeListPage";
import AnimeDetailPage from "./pages/animeDetailPage";
import CollectionListPage from "./pages/collectionListPage";
import CollectionDetailPage from "./pages/collectionDetailPage";
import HomeNavbar from "./components/homeNavbar";

function App() {
  return (
    <div className="App">
      <HomeNavbar />
      {/* With navbar outside of router the page loaded will be the routes only when the path is changed */}
      <Container>
        <Router>
          <Routes>
            <Route path="/" element={<AnimeListPage />} />
            <Route path="/anime_details" element={<AnimeDetailPage />} />
            <Route path="/collections" element={<CollectionListPage />} />
            <Route
              path="/collections_details"
              element={<CollectionDetailPage />}
            />
          </Routes>
        </Router>
      </Container>
    </div>
  );
}

export default App;
