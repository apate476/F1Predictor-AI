import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef, lazy, Suspense } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const Home = lazy(() => import("./pages/Home"));
const Drivers = lazy(() => import("./pages/Drivers"));
const Races = lazy(() => import("./pages/Races"));
const Chat = lazy(() => import("./pages/Chat"));
const About = lazy(() => import("./pages/About"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-[3px] bg-red rounded animate-pulse" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function AnimatedPage({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("page-enter");
    requestAnimationFrame(() => {
      el.classList.remove("page-enter");
      el.classList.add("page-enter-active");
      el.addEventListener(
        "transitionend",
        () => el.classList.remove("page-enter-active"),
        { once: true },
      );
    });
  }, []);
  return <div ref={ref}>{children}</div>;
}

function ChatBubble() {
  return (
    <button
      onClick={() => (window.location.href = "/chat")}
      aria-label="Open AI chat"
      className="fixed bottom-7 right-7 w-[52px] h-[52px] rounded-full bg-red border-none cursor-pointer flex items-center justify-center text-xl z-50 animate-pulse-red transition-all duration-200 hover:scale-110 hover:shadow-[0_6px_32px_rgba(232,0,45,0.5)]"
    >
      🏎
    </button>
  );
}

function AppLayout() {
  const { pathname } = useLocation();
  const isChatPage = pathname === "/chat";

  return (
    <div className="flex flex-col min-h-screen bg-bg text-f1-text font-body">
      <div className="grain" aria-hidden />
      <Nav />
      <main className="pt-nav flex-1">
        <Suspense fallback={<PageLoader />}>
          <AnimatedPage>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/races" element={<Races />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </AnimatedPage>
        </Suspense>
      </main>
      <Footer />
      {!isChatPage && <ChatBubble />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}
