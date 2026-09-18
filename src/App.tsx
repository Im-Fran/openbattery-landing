import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Why from "./components/Why";
import MenuBar from "./components/MenuBar";
import Features from "./components/Features";
import { History, LimitCharging, Accessibility } from "./components/Story";
import Get from "./components/Get";
import Footer from "./components/Footer";
import LangSwitch from "./components/LangSwitch";

export default function App() {
  return (
    <>
      <LangSwitch />
      <main>
        <Hero />
        <Stats />
        <Why />
        <MenuBar />
        <Features />
        <History />
        <LimitCharging />
        <Accessibility />
        <Get />
      </main>
      <Footer />
    </>
  );
}
