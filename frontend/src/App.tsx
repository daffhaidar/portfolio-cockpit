import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import Instruments from "./sections/Instruments";
import FlightLog from "./sections/FlightLog";
import Payload from "./sections/Payload";
import BlackBox from "./sections/BlackBox";

export default function App() {
  return (
    <div className="grain min-h-screen bg-deck-900">
      <span id="top-sentinel" className="absolute top-0 h-px w-px" />
      <Nav />
      <main>
        <Hero />
        <Instruments />
        <FlightLog />
        <Payload />
        <BlackBox />
      </main>
      <Footer />
    </div>
  );
}
