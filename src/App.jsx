/* 
entry point of the application
set up with routing, page navigation, context management
UserProvider = Global Store for retrieving states/data
PageVisited = Component for tracking visited pages
BrowserRouter = Enables navigation/routing without full page reloads
Routes = Grouping all Route
Route = definfing path navigation/route
*/

import React from "react";
import { UserProvider } from "./Store/UserContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import GameList from "./Pages/GameList/GameList";
import Sudoku from "./Games/Sudoku/Sudoku";
import GridGame from "./Games/GridGame/Grid";
import TicTacToe from "./Games/TicTacToe/TicTacToe";
import ProfilePage from "./Pages/ProfilePage";
import Stats from "./Pages/Stats";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import PageVisited from "./Pages/Routing/PageVisited";
import Upload from "./Components/Upload";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/gamepage"
            element={
              <PageVisited>
                <GameList />
              </PageVisited>
            }
          />
          <Route
            path="/gridgame"
            element={
              <PageVisited>
                <GridGame />
              </PageVisited>
            }
          />
          <Route
            path="/sudoku"
            element={
              <PageVisited>
                <Sudoku />
              </PageVisited>
            }
          />
          <Route
            path="/tictactoe"
            element={
              <PageVisited>
                <TicTacToe />
              </PageVisited>
            }
          />
          <Route
            path="/profilepage"
            element={
              <PageVisited>
                <ProfilePage />
              </PageVisited>
            }
          />

          <Route
            path="/showstats"
            element={
              <PageVisited>
                <Stats />
              </PageVisited>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
