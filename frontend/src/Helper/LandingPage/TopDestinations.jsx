import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SplitText from "./SplitText";
const cards = [
  {
    id: 1,
    img: "https://sushantsinha77.com/wp-content/uploads/2023/07/netarhat-jharkhand-india-february-15-260nw-1842804121-edited.jpg",
    title: "Netarhat Hills",
    desc: "Beautiful hills and sunrise point.",
    link: "/details/6921ff47746c13a31216648e",
  },
  {
    id: 2,
    img: "https://www.india-tours.com/wildlife/images/wildlife/national-parks/betla-national-park.jpg",
    title: "Betla National Park",
    desc: "Lush forest & wildlife safari.",
    link: "/details/6921ff47746c13a312166490",
  },
  {
    id: 3,
    img: "https://th.bing.com/th/id/R.027bcb940a7e19447fe1c417abc349a5?rik=HCYFUA1ZlthF2Q&riu=http%3a%2f%2fim.hunt.in%2fcg%2fRanchi%2fCity-Guide%2fHundru-falls2.JPG&ehk=6IqXUfKQqj8pOYf8fuzUkOhNsNZjfwgIwxiCQ7uNQfE%3d&risl=&pid=ImgRaw&r=0",
    title: "Hundru Falls",
    desc: "Massive beautiful waterfall.",
    link: "/details/6921ff47746c13a312166491",
  },
  {
    id: 4,
    img: "https://th.bing.com/th/id/R.7e6c69ea42c7520000d58a0f2d4b014f?rik=AQSTOYruISC%2f6Q&riu=http%3a%2f%2fwww.team-bhp.com%2fforum%2fattachments%2ftravelogues%2f983280d1347210375-scintillating-patratu-valley-jharkhand-dsc04653.jpg&ehk=FNklXX9kDQeehvKY7MrrvFO%2bItfm8QMdNK9SrGMFlu4%3d&risl=&pid=ImgRaw&r=0",
    title: "Patratu Valley",
    desc: "Hill valley with lake.",
    link: "/details/6921ff47746c13a31216648f",
  },
  {
    id: 5,
    img: "https://www.oyorooms.com/travel-guide/wp-content/uploads/2019/09/Deoghar-Baidyanath-Temple.jpg",
    title: "Baidyanath Jyotirlinga",
    desc: "Baidyanath Jyotirlinga is one of the 12 sacred Jyotirlingas of Lord Shiva and attracts millions of devotees every year.",
    link: "/details/6921ff47746c13a312166492",
  },
  {
    id: 6,
    img: "https://i.ytimg.com/vi/hHLUI1gkZ2Y/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBhNYf4kmH0QicHZWLuojrQTLBFVQ",
    title: "Bokaro steel city",
    desc: "Bokaro Steel City is famous for its industrial significance, particularly the Bokaro Steel Plant, which is one of the largest in India.",
    link: "/places",
  },
  {
    id: 7,
    img: "https://t3.ftcdn.net/jpg/06/21/17/72/360_F_621177263_tCEXLhnqj32aIlM8LK4xd7oS7WuavUOn.jpg",
    title: "Jamshedpur",
    desc: "Jamshedpur is a city in the eastern Indian state of Jharkhand, known as the Steel City of India",
    link: "/places",
  },
];
function TopDestinations() {
  const [index, setIndex] = useState(0);
  const [places, setPlaces] = useState([]);
  const next = () => setIndex((prevIndex) => (prevIndex + 1) % cards.length);
  const prev = () => setIndex((index - 1 + cards.length) % cards.length);
  const slide = cards[index];

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/places`)
      .then((response) => response.json())
      .then((data) => setPlaces(data))
      .catch((error) => console.error("Error fetching places:", error));
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative max-h-screen  bg-white bg-opacity-90 text-green-900 overflow-hidden">
      {/* ⭐ Full-screen blurred background */}
      <div
        className=""
        
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-20">
        <SplitText
          text="Discover Top Destinations"
          className="text-4xl lg:text-5xl font-playfair mb-10 drop-shadow-xl font-bold"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-90px"
          textAlign="center"
        />

        {/* ⭐ MAIN CARD WITH SLIDE ANIMATION */}
        <div className="relative w-full flex rounded-xl overflow-hidden shadow-2xl mb-2">
          <div
            className="relative w-full rounded-xl overflow-hidden shadow-2xl h-64  md:h-96">
            {/* Slide wrapper */}
            <div
              className="absolute top-0 left-0 flex h-full w-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {cards.map((s, i) => (
                <div key={i} className="w-full h-full flex-shrink-0">
                  <Link to={s.link} className="block w-full h-full">
                    <img
                      src={s.img}
                      alt={s.title}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </Link>
                </div>
              ))}
            </div>
            {/* Caption */}
            <div className="absolute bottom-4 left-4 right-2 rounded-xl mr-4 h-25 p-4 text-white bg-black bg-opacity-40 drop-shadow-lg pointer-events-none">
              <h2 className="text-2xl lg:text-3xl font-serif pl-2">{slide.title}</h2>
              <p className="text-sm opacity-80 pl-2">{slide.desc}</p>
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
          </div>

          {/* Arrows */}
          <div className="absolute right-9 bottom-8 flex items-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-black bg-opacity-40 border border-white flex items-center justify-center backdrop-blur-sm hover:bg-opacity-70 transition text-white"
            >
              ←
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-black bg-opacity-40 border border-white flex items-center justify-center backdrop-blur-sm hover:bg-opacity-70 text-white transition"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TopDestinations;
