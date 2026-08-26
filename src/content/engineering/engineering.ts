export interface EngProject {
    name:     string;
    tagline:  string;
    liveUrl:  string;
    repoUrl:  string;
    stack:  string[];
    quantum:  string;
    points: string[];
}

export const engineering = {
    intro: {
      kicker: "Engineering",
      title: "I build the systems, not just design them.",
      lead: "Beyond game design, I build full-stack applications and quantum computing prototypes. The same instinct drives both: understand a system deeply enough to make it real. Here is a quieter, more technical companion to the games work.",
    },
    quantumNote: {
      title: "Quantum-inspired game design",
      body: "My Moon-Knight combat system maps real quantum principles to RPG mechanics, backed by a hand-built C++ quantum toolkit. The deep technical write-up lives on its own page.",
      href: "/moon-knight/engineering/quantum",
      linkLabel: "Read the quantum toolkit deep-dive",
    },
    projects: [
      {
        name: "QuantumRisk",
        tagline:
          "A full-stack quantum finance app that prices European call options and calculates Value at Risk two ways: Iterative Quantum Amplitude Estimation against classical Monte Carlo.",
        liveUrl: "https://quantum-risk-z9ez.vercel.app",
        repoUrl: "https://github.com/alvarogope/QuantumRisk",
        stack: ["Qiskit", "Python", "FastAPI", "React", "NumPy"],
        quantum:
          "IQAE encodes a log-normal price distribution into quantum amplitudes and extracts expected payoff with O(1/N) convergence, a quadratic speedup over Monte Carlo's O(1/\u221AN).",
        points: [
          "Prices options via a 3-qubit IQAE circuit with log-normal amplitude encoding and a payoff oracle, shown side by side with a 10,000-path Monte Carlo baseline.",
          "Calculates portfolio VaR at 95% confidence using both methods, with live market data and volatility pulled from Yahoo Finance.",
          "Documents hardware constraints honestly: statevector simulation, 8 price bins, quantum advantage theoretical but the algorithm hardware-ready.",
        ],
      },
      {
        name: "Quantum Portfolio Optimizer",
        tagline:
          "A hybrid quantum-classical optimizer that solves asset allocation as a QUBO problem: QAOA selects which stocks to hold, classical mean-variance optimization sets the weights.",
        liveUrl: "https://quantum-portfolio-optimizer-o3hq.vercel.app",
        repoUrl: "https://github.com/alvarogope/Quantum-Portfolio-Optimizer",
        stack: ["Qiskit", "Python", "FastAPI", "React", "Tailwind", "Vite"],
        quantum:
          "QAOA builds a superposition of all 2^n possible portfolios, amplifies strong selections through cost and mixer layers tuned by COBYLA, and collapses to the optimal subset on measurement.",
        points: [
          "Returns optimal allocation percentages with expected return, volatility, Sharpe ratio and QAOA energy, plus a view of the actual quantum circuit used.",
          "Offers Conservative, Balanced and Aggressive risk profiles with a GBP per-stock breakdown, backed by live Yahoo Finance data.",
          "Handles up to 9 assets (9 qubits) under statevector memory limits, with a glassmorphism React UI.",
        ],
      },
    ],
    stack: {
      kicker: "Full stack",
      web: ["TypeScript", "JavaScript", "React", "Next.js", "Node.js", "FastAPI", "SQLAlchemy", "C++"],
      quantum: ["Qiskit", "Quantum++ (C++)", "IQAE", "QAOA"],
    },
  };