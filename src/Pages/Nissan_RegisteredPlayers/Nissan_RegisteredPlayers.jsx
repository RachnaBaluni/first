import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./RegisteredPlayers.module.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

const RegisteredPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  /* =============================
     FETCH PLAYERS
  ============================= */
  const getPlayers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/player/`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setPlayers(res.data.data || []); // ✅ FIX: fallback array
      } else {
        setPlayers([]);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      setPlayers([]); // ✅ FIX: avoid undefined crash
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     FETCH EVENTS
  ============================= */
  const getEvents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/events/`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const eventData = res.data.data || [];
        setEvents(eventData);

        // ✅ FIX: safe default selection
        if (eventData.length > 0) {
          setSelectedEvent(eventData[0]._id);
        }
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.log("Error fetching events:", error);
      setEvents([]);
    }
  };

  useEffect(() => {
    getPlayers();
    getEvents();
    window.scrollTo(0, 0);
  }, []);

  /* =============================
     FILTER LOGIC
  ============================= */

  const filteredPlayers = (players || []).filter((player) => {
    const matchesEvent = selectedEvent
      ? player.eventId?._id === selectedEvent
      : true;

    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      player.partner1?.name?.toLowerCase().includes(lowerSearch) ||
      player.partner2?.name?.toLowerCase().includes(lowerSearch) ||
      player.eventId?.name?.toLowerCase().includes(lowerSearch);

    return matchesEvent && matchesSearch;
  });

  /* =============================
     SORT LOGIC
  ============================= */

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    const aComplete = !!(a.partner1 && a.partner2);
    const bComplete = !!(b.partner1 && b.partner2);

    if (aComplete !== bComplete) {
      return aComplete ? -1 : 1;
    }

    const nameA = a.partner1?.name?.toLowerCase() || "";
    const nameB = b.partner1?.name?.toLowerCase() || "";

    return nameA.localeCompare(nameB);
  });

  return (
    <>
      <Header />

      <div className={styles.container}>
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Registered Teams</h2>

          {/* SEARCH & FILTER */}
          <div className={styles.filtersContainer}>
            <input
              type="text"
              placeholder="Search players or events..."
              className={styles.searchBar}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className={styles.eventFilters}>
              {(events || []).map((event) => (
                <button
                  key={event._id}
                  className={`${styles.filterButton} ${
                    selectedEvent === event._id ? styles.activeFilter : ""
                  }`}
                  onClick={() => setSelectedEvent(event._id)}
                >
                  {event.name}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          {loading ? (
            <div className={styles.noPlayersMessage}>
              Loading registered players...
            </div>
          ) : sortedPlayers.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.playersTable}>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Player 1</th>
                    <th>Player 2</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedPlayers.map((player) => (
                    <tr key={player._id}>
                      <td data-label="Event">
                        {player.eventId?.name || "N/A"}
                      </td>

                      <td data-label="Player 1">
                        {player.partner1?.name || "N/A"}
                      </td>

                      <td data-label="Player 2">
                        {player.partner2?.name ||
                          "Partner Not Yet Registered"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.noPlayersMessage}>
              No registered players found matching your criteria.
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
};

export default RegisteredPlayers;