import { useState } from "react";
import { createStore, useStore } from "zustand";
import "./App.css";

interface CountStore {
  count: number;
  setCount: (count: number) => void;
}

const store = createStore<CountStore>()((set) => ({
  count: 0,
  setCount: (count) => {
    set((prev) => (prev.count === count ? prev : { count }));
  },
}));

function selectCount(state: CountStore) {
  console.log("global (stable) selector invoked");
  return state.count;
}

function selectSetCount(state: CountStore) {
  console.log("global (stable) selector 2 invoked");
  return state.setCount;
}

function App() {
  // const count = useStore(store, (state) => {
  //   console.log("local (unstable) selector invoked");
  //   return state.count;
  // });
  const count = useStore(store, selectCount);
  const setCount = useStore(store, (state) => {
    console.log("local (unstable) selector 2 invoked");
    return state.setCount;
  });
  // const setCount = useStore(store, selectSetCount);

  const [bool, setBool] = useState(false);
  const toggleBool = () => setBool((prev) => !prev);

  return (
    <>
      <p>
        This app attempts to explore how Zustand treats stable and unstable
        selectors differently. Examine the browser console logs as you click on
        the following buttons to modify local and global (Zustand) state.
      </p>
      <div className="card">
        <button onClick={() => setCount(count + 1)}>
          Update count ({count})
        </button>
        <button onClick={toggleBool}>
          Toggle local state ({String(bool)})
        </button>
      </div>
    </>
  );
}

export default App;
