import "@testing-library/jest-dom";

// Mock framer-motion to render plain elements in unit tests
vi.mock("framer-motion", () => {
  const React = require("react");
  const actual = {
    motion: new Proxy(
      {},
      {
        get: (_target: unknown, prop: string) => {
          return React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
            const {
              animate: _a,
              initial: _i,
              exit: _e,
              transition: _t,
              whileInView: _w,
              whileHover: _wh,
              whileTap: _wt,
              viewport: _v,
              variants: _va,
              ...rest
            } = props;
            return React.createElement(prop, { ...rest, ref });
          });
        },
      }
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useSpring: (val: unknown) => val,
    useInView: () => true,
  };
  return actual;
});

// Mock IntersectionObserver for jsdom
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "IntersectionObserver", {
  value: MockIntersectionObserver,
});
