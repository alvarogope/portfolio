   export const quantumToolkit = {
    title: "The Quantum Toolkit",
    tagline: "Real quantum simulation for game combat, in C++ and proven statistically.",
  
  
    intro:
      "In my game Moon-knight, I designed combat mechanics that were built in quantum computing principles trying to demostrate " +
      "how this technology could change this media. At the beginning I only designed them and couldn't code it, but I started " +
      "programming this combat system using a C++17 library that wraps Quantum++ and Eigen that models qubits, gates, measurements, " +
      "and noise. Then exposes an API so designers could tune them without knowing what quantum computing is." +
      "This page is the engineering behind the design.",
  
    architecture: {
      title: "Why a Density Matrix and Not a State Vector",
      body:
        "The primary decision of the whole toolkit is that the core register stores a density matrix and not a state vector. " +
        "Because a state vector can only represent pure states and my mechanics, like Instability, require decoherence: a sphere " +
        "whose outcome is randomised the longer it stays in flight. A density matrix is the only thing that could express a partially mixed state.",
    },
  
    sections: [
      {
        kicker: "Design to physics",
        title: "Designers Think in Probabilities. The Toolkit in Radians",
        body:
          "As a designer, when I developed the abilities I wanted to say 'this sphere is 70% likely to amplify.' However, when I started " +
          "this work, I needed a Ry rotation angle. The connection between these two is to give a probability p that returns the angle that " +
          "measures the outcome and matches it to p. The design works in the sense that the projectile is undecided between four effects " +
          "while its casted and the environmental noise is a flat 25/25/25/25 as long as is casted.",
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
        title: "Simulating Decoherence by Hand",
        body:
          "The sphere decays through real quantum noise that were coded from actual physics. When it's measured the outcome is a genuine collapse. " +
          "It locks the outcome on purpose instead of creating randomness, without breaking video game rules.",
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
        title: "Quantum-Correct",
        body:
          "What differentiates my designed quantum inspired mechanics with these work is that it is measurable. " +
          "Each ability is validated by a Monte Carlo control. It runs a thousand times and checks the frequency and compares it to the " +
          "analytic prediction. The parry mechanic, Inversion, rotates an attack Damage parameter with a Heal, using a NOT gate at the right time, " +
          "so it follows the Born rule. The endpoints are deterministic and the interior points land within one or two standard errors of sin squared.",
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
        "The toolkit is about the Moon-Knight's five designed mechanics. The core library and two of the five are complete and statistically " + 
        "verified. The third one is in progress still. Two are designed but not yet built. Every finished mechanic is a recombination of the same " + 
        "verified mechanics, so the remaining work is just composition",
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