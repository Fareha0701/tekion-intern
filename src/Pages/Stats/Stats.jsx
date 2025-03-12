import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Store/UserContext";
import NavBar from "../../Components/NavBar";
import "./Stats.scss";
import { BiFilterAlt, BiSearch, BiX } from "react-icons/bi";
import { fetchUserGameStats } from "../../backend/firebase";

export default function Stats() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const recordsPerPage = 5;
  const userContext = useContext(UserContext); // First get the context
  const userId = userContext?.userId;
  const username = userContext?.username;

  useEffect(() => {
    const loadUserStats = async () => {
      if (!userId) {
        setData([]);
        setFilteredData([]);
        return;
      }
      try {
        console.log("Fetching stats for userId:", userId);
        const userStats = await fetchUserGameStats(userId);
        setData(userStats);
        setFilteredData(userStats);
      } catch (error) {
        console.error("Error loading stats:", error);
        setData([]);
        setFilteredData([]);
      }
    };
    loadUserStats();
  }, [userId]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter((stat) =>
        stat.game.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const totalPages =
    filteredData.length > 0
      ? Math.ceil(filteredData.length / recordsPerPage)
      : 1;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };
  const renderPagination = () => {
    let pages = [];
    let maxPageButtons = 3; // number of visible page buttons before adding "..."

    if (totalPages <= maxPageButtons + 2) {
      // show all pages if there are few pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // always show first and last page
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((page, index) =>
      page === "..." ? (
        <span key={index} className="dots">
          ...
        </span>
      ) : (
        <button
          // className="PageButton"
          key={index}
          onClick={() => goToPage(page)}
          className={currentPage === page ? "activePage" : ""}
        >
          {page}
        </button>
      )
    );
  };
  const formatDate = (dateString, timeString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    const suffix =
      day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";

    return `${day}${suffix} ${month} ${year}, ${timeString}`;
  };

  return (
    <>
      <NavBar />
      <div className="StatsMainCon">
        <div className="StatsHeading">
          <h3>My Stats</h3>
        </div>
        <div className="ContentDiv">
          <div className="filterNsearch">
            <div>
              <BiFilterAlt size={30} color="grey" />
            </div>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: "300px",
                marginLeft: "-20px",
              }}
            >
              <BiSearch
                style={{
                  position: "absolute",
                  left: 10,
                  top: 8,
                  color: "gray",
                }}
              />
              <input
                type="text"
                // placeholder="Search..."
                className="searchBar"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ paddingLeft: 30 }}
              />
              {searchTerm && (
                <BiX
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 8,
                    cursor: "pointer",
                    color: "gray",
                  }}
                  onClick={clearSearch}
                />
              )}
            </div>
          </div>
          <div className="tableCon">
            <table className="table">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Won</th>
                  <th>Lost</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((row, index) => (
                  <tr key={index}>
                    <td>{row.game}</td>
                    <td>{row.won}</td>
                    <td>{row.lost}</td>
                    <td>{formatDate(row.date, row.time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="PageButton"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {renderPagination()}
                <button
                  className="PageButton"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
