/* Engineering deep-dive content: the Moon-Knight Quantum Toolkit.
   Technical audience. Honest, code-forward, verification-led. */

   export const quantumToolkit = {
    title: "The Quantum Toolkit",
    tagline: "Real quantum simulation for game combat, in C++, and proven statistically.",
  
    repoUrl: "#", // private until the tree builds and EllipticalPair is finished
  
    intro:
      "Moon-Knight's combat mechanics are built on real quantum computing principles. Not quantum-flavoured randomness, but an actual quantum simulation: a C++17 library wrapping Quantum++ and Eigen that models qubits, gates, measurement, and noise, then exposes a small game-facing API so the mechanics can be tuned by designers who never touch the physics. This page is the engineering behind the design.",
  
    architecture: {
      title: "Why a density matrix, not a state vector",
      body:
        "The load-bearing decision in the whole toolkit is that the core register stores a density matrix, not a state vector. A state vector can only represent pure states, and the Instability mechanic depends on decoherence: a projectile whose outcome distribution degrades toward classical randomness the longer it stays in flight. Only a density matrix can express that partially-mixed state. Everything else follows from that choice.",
    },
  
    sections: [
      {
        kicker: "Design to physics",
        title: "Designers think in probabilities; the library speaks radians",
        body:
          "A designer authoring the Instability ability wants to say 'this thrower is 70% likely to amplify.' The register needs an Ry rotation angle. The bridge is one function: given a probability p, it returns the angle that makes the measured outcome match p exactly. Gameplay tuning stays in gameplay units; the quantum layer stays hidden. The projectile is genuinely undecided between four effects while airborne, and environmental noise erodes the thrower's skill-bias toward a flat 25/25/25/25 the longer it flies.",
        code: {
          filename: "src/InstabilitySphere.cpp",
          language: "cpp",
          body: `namespace
  {
      // Designers author a probability (0..1); the register needs an Ry angle.
      // theta = 2*arccos(sqrt(1-p))  =>  P(|1>) == p exactly.
      double BiasToAngle(double bias)
      {
          return 2.0 * std::acos(std::sqrt(1.0 - bias));
      }
  }
  
  InstabilitySphere::InstabilitySphere(const ThrowerProfile& profile)
      : Reg(2), Profile(profile), Collapsed(false), Result(Outcome::Amplify)
  {
      Reg.ApplyRy(0, BiasToAngle(Profile.BiasQubit0));
      Reg.ApplyRy(1, BiasToAngle(Profile.BiasQubit1));
  }
  
  void InstabilitySphere::Tick(double deltaSeconds)
  {
      if (Collapsed) { return; }
  
      // Longer flight = more decoherence = the skill bias erodes toward 25/25/25/25.
      const double strength = Profile.NoisePerSecond * deltaSeconds;
      Reg.ApplyDepolarizing(0, strength);
      Reg.ApplyDepolarizing(1, strength);
  }
  
  Outcome InstabilitySphere::Roll()
  {
      if (Collapsed) { return Result; }
  
      const int bit0 = Reg.Measure(0);
      const int bit1 = Reg.Measure(0);   // measurement is destructive: qubit 1 is now index 0
  
      const int slot = bit0 * 2 + bit1;
      Result = static_cast<Outcome>(slot);
      Collapsed = true;
      return Result;
  }`,
        },
      },
      {
        kicker: "The physics",
        title: "Simulating decoherence by hand",
        body:
          "The noise that erodes the projectile is a depolarising channel, written out as the textbook Kraus form rather than pulled from a library helper. It is trace-preserving by construction and drives the qubit toward the maximally mixed state. Measurement is a real projective collapse: the register is replaced by its post-measurement state, so the outcome is irreversible, not a cosmetic dice roll.",
        code: {
          filename: "src/QuantumRegister.cpp",
          language: "cpp",
          body: `void QuantumRegister::ApplyDepolarizing(int qubit, double strength)
  {
      const double p = strength / 4.0;
      const qpp::idx q = static_cast<qpp::idx>(qubit);
  
      // rho -> (1-s)rho + (s/4)(rho + XrhoX + YrhoY + ZrhoZ)
      // Trace-preserving; drives the qubit toward the maximally mixed state I/2.
      qpp::cmat mixed = (1.0 - strength) * State;
      mixed += p * qpp::apply(State, qpp::gt.X, { q });
      mixed += p * qpp::apply(State, qpp::gt.Y, { q });
      mixed += p * qpp::apply(State, qpp::gt.Z, { q });
      mixed += p * State;
  
      State = mixed;
  }
  
  int QuantumRegister::Measure(int qubit)
  {
      auto [result, probs, states] =
          qpp::measure(State, qpp::gt.Z, { static_cast<qpp::idx>(qubit) });
  
      State = states[result];   // collapse is real and irreversible
      --Qubits;
      return static_cast<int>(result);
  }`,
        },
      },
      {
        kicker: "The proof",
        title: "Quantum-correct, not quantum-flavoured",
        body:
          "The difference between a mechanic that is 'quantum-themed' and one that is quantum-correct is measurable. Each mechanic is validated by a Monte Carlo harness: run it a thousand times and check the empirical frequency against the analytic quantum prediction. The parry mechanic (Inversion) rotates an incoming attack between damage and heal; perfect timing is a full NOT gate, sloppy timing a partial rotation, so the heal chance follows the Born rule exactly. The endpoints are deterministic; the interior points land within one or two standard errors of sin squared.",
        code: {
          filename: "src/main.cpp",
          language: "cpp",
          body: `// 1000-trial validation of the parry skill curve
  for (double quality : {0.0, 0.5, 0.8, 1.0}) {
      int heals = 0;
      for (int i = 0; i < 1000; ++i) {
          mk::AttackPayload attack;
          attack.Parry(quality);
          if (attack.Resolve() == mk::PayloadResult::Heal) ++heals;
      }
      std::cout << "timing " << quality
          << " -> healed " << heals << " / 1000\\n";
  }
  
  // Actual output:
  // timing 0    -> healed    0 / 1000    theory sin2(0)      = 0.000
  // timing 0.5  -> healed  486 / 1000    theory sin2(pi/4)   = 0.500
  // timing 0.8  -> healed  912 / 1000    theory sin2(0.4pi)  = 0.905
  // timing 1    -> healed 1000 / 1000    theory sin2(pi/2)   = 1.000`,
        },
      },
    ],
  
    status: {
      title: "Honest status",
      body:
        "The toolkit maps onto Moon-Knight's five designed mechanics. The core library and two of the five are complete and statistically verified; the third is in progress; two are designed but not yet built. Every finished mechanic is a recombination of the same verified primitives, so the remaining work is composition, not new physics.",
      rows: [
        { component: "QuantumRegister (core library)", ability: "—", state: "Complete · verified" },
        { component: "InstabilitySphere", ability: "Instability", state: "Complete · verified" },
        { component: "AttackPayload", ability: "Inversion", state: "Complete · verified" },
        { component: "EllipticalPair", ability: "Elliptical Force", state: "In progress" },
        { component: "—", ability: "Master of Matters", state: "Designed, not built" },
        { component: "—", ability: "Double Superposition", state: "Designed, not built" },
      ],
    },
  };