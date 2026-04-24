import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Home.module.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tournamentDetail, setTournamentDetail] = useState([]);
  const [pricesBenefit, setpricesBenefit] = useState([]);
  const [venue, setvenue] = useState([]);

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
        setEvents(res.data.data || []); 
        // ✅ FIX: fallback added so map crash not happen
      }
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  };

  const getTournamentDetail = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/tournament-details/`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setTournamentDetail(res.data.data || []);
        // ✅ FIX
      }
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  };

  const getPricesBenifit = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/prices-benifit/`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setpricesBenefit(res.data.data || []);
        // ✅ FIX
      }
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  };

  const getvenue = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/venue/`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setvenue(res.data.data || []);
        // ✅ FIX
      }
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    getEvents();
    getTournamentDetail();
    getPricesBenifit();
    getvenue();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.homeContainer}>
      <Header />

      <main className={styles.mainContent}>

        {/* EVENTS SECTION */}
        <section className={styles.section} id="eventDetails">
          <h2>Tournament Categories</h2>

          <ul>
            {events.length > 0 ? (
              events.map((event) => (
                <li key={event._id}>{event.name}</li>
              ))
            ) : (
              <li>No categories available</li>
            )}
          </ul>
          {/* ✅ FIX: safe map already used */}
        </section>

        {/* TOURNAMENT DETAILS */}
        {tournamentDetail.map((item) =>
          item.key === "1" ? (
            <div key={item._id}>
              {item.showing && (
                <>
                  <h4>{item.title}</h4>
                  <p
                    className="db-content"
                    dangerouslySetInnerHTML={{ __html: item.value }}
                  />
                </>
              )}
            </div>
          ) : null
        )}
        {/* ⚠️ FIX NEEDED: agar crash aaye to (tournamentDetail || []).map use karo */}

        {/* PRICES BENEFIT */}
        {pricesBenefit.map((item) =>
          item.key === "1" ? (
            <div key={item._id}>
              <h3>{item.title}</h3>
              {item.showing && (
                <p
                  className="db-content"
                  dangerouslySetInnerHTML={{ __html: item.value }}
                />
              )}
            </div>
          ) : null
        )}
        {/* ⚠️ FIX NEEDED SAME */}

        {/* VENUE */}
        {venue.map((item) =>
          item.key === "1" ? (
            <div key={item._id}>
              <h3>{item.title}</h3>
              <h2>{item.venue}</h2>
              <p>{item.address}</p>
            </div>
          ) : null
        )}
        {/* ⚠️ FIX NEEDED SAME */}

      </main>

      <Footer />
    </div>
  );
}