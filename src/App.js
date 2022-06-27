import "./App.css";
/** @jsxImportSource @emotion/react */

import { Container, Nav, Navbar } from "react-bootstrap";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AnimeListPage from "./animeListPage";
import AnimeDetailPage from "./animeDetailPage";
import CollectionListPage from "./collectionListPage";

function HomeNavbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Anime list</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Anime List</Nav.Link>
            <Nav.Link href="/collections">Collections</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function App() {
  return (
    <div className="App">
      <HomeNavbar />
      <Container>
        <Router>
          <Routes>
            <Route path="/" element={<AnimeListPage />} />
            <Route path="/details" element={<AnimeDetailPage />} />
            <Route path="/collections" element={<CollectionListPage />} />
          </Routes>
        </Router>
      </Container>
    </div>
  );
}

export default App;
