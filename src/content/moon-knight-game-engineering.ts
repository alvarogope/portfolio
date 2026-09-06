/**
 * Content for /moon-knight/engineering — the game-programming page.
 *
 * The `code` strings below are SLOTS. Each one currently holds a marked
 * placeholder comment; replace the whole template literal with the real
 * source from the UE5 project and Shiki will highlight it as C++ with no
 * other change needed. Keep `filename` and `language` accurate — the
 * CodeBlock header renders both.
 */

export interface CodeSlot {
  filename: string;
  language: string;
  code: string;
}

export interface SplitRow {
  system: string;
  detail: string;
  /** Where the logic actually lives. */
  home: "Blueprint" | "C++";
  /** The concrete asset or class that owns it. */
  owner: string;
}

export interface CodingChoice {
  id: string;
  kicker: string;
  title: string;
  /** The call that was made. One sentence, stated flatly. */
  decision: string;
  /** Why it was made that way — the portfolio value. */
  why: string[];
  code: CodeSlot;
}

export interface CombatState {
  name: string;
  detail: string;
  /** What moves the player out of this state. */
  exits: string;
  accent?: "gold" | "scarlet" | "emerald";
}

export interface ScreenshotSlot {
  id: string;
  label: string;
  caption: string;
  /** Set this to a path under /public once the capture exists. */
  src?: string;
  alt?: string;
}

export const gameEngineering = {
  eyebrow: "GAME PROGRAMMING · UNREAL ENGINE 5 · C++ & BLUEPRINT · SOLO",
  title: "Programming Moon-Knight",
  thesis: "C++ decides WHEN. Blueprint decides WHAT IT LOOKS LIKE.",

  tagline:
    "A solo UE5 dark-fantasy RPG with every core system designed and built from scratch: combat, AI, persistence, and equipment.",

  intro:
    "Moon-Knight is a solo project. There is no engineer to hand the design to, which means every system on this page was specified, written, debugged and tuned by the same person. That constraint produced the discipline the page is about: a hard, deliberate boundary between the two languages Unreal gives you. Systems logic — state, ownership, lifetime, damage — is C++, because it is testable, diffable and fast. Visual and timing work — combo montages, trace windows, behaviour trees — is Blueprint, because it iterates in seconds instead of a recompile. Everything below is one of those decisions and the reasoning behind it.",

  stack: [
    "Unreal Engine 5",
    "C++",
    "Blueprint",
    "Enhanced Input",
    "Behaviour Trees",
    "AI Perception",
    "UMG",
    "Data Tables",
  ],

  repoUrl: "https://github.com/alvarogope/Moon-Knight-UE5-RPG",
  repoLabel: "Moon-Knight-UE5-RPG on GitHub",

  /* ---------------------------------------------------------------- */

  split: {
    kicker: "The boundary",
    title: "What lives in Blueprint, what lives in C++",
    intro:
      "The split is principled, not incidental. If a system owns state other systems read, or has to survive a level load, it is C++. If it exists to make something look or feel right on a specific frame, it is Blueprint. The table is the whole architecture in one view.",
    rows: [
      {
        system: "Combat combo chain",
        detail: "Montage sequencing, sword trace, ApplyDamage call",
        home: "Blueprint",
        owner: "BPC_Attack System",
      },
      {
        system: "Enemy behaviour",
        detail: "Behaviour Trees, Blackboard, patrol tasks",
        home: "Blueprint",
        owner: "BD_AI, BD_Werewolf",
      },
      {
        system: "AI perception",
        detail: "Detection, sight and hearing stimulus, Blackboard writes",
        home: "C++",
        owner: "AMKEnemyAIController",
      },
      {
        system: "Inventory & equipment",
        detail: "Data Table lookup, equip socket swap",
        home: "Blueprint",
        owner: "BPC_Equipment System",
      },
      {
        system: "Player systems",
        detail: "Health, combo state, death and respawn",
        home: "C++",
        owner: "AMKPlayerCharacter",
      },
      {
        system: "Session persistence",
        detail: "Willow Tree checkpoints, equipped weapon",
        home: "C++",
        owner: "UMKGameInstance",
      },
    ] as SplitRow[],
  },

  /* ---------------------------------------------------------------- */

  choicesKicker: "The decisions",
  choicesTitle: "Five coding choices that shaped the build",
  choicesIntro:
    "Each of these is a call made once and then lived with across the whole project. The reasoning matters more than the syntax, so it leads.",

  choices: [
    {
      id: "hybrid-architecture",
      kicker: "Architecture",
      title: "The hybrid architecture",
      decision:
        "Every gameplay Blueprint is reparented to a C++ class. Blueprint calls DOWN into C++ through BlueprintCallable; C++ calls UP into Blueprint through BlueprintImplementableEvent.",
      why: [
        /* The boundary itself is stated by the thesis, the intro and
           split.intro before this point. What follows are its consequences,
           which is what this list is for. */
        "That gives one direction of authority and no ambiguity about where a bug lives. If the wrong thing happened, it is C++. If the right thing happened and looked wrong, it is Blueprint.",
        "It also keeps iteration cheap exactly where iteration is needed. Retiming a combo is a Blueprint tweak and a Play-In-Editor press; it never costs a compile.",
      ],
      code: {
        filename: "MKPlayerCharacter.h",
        language: "cpp",
        code: `#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "MoonKnightRPG.h"                    
#include "MKPlayerCharacter.generated.h" 

UCLASS()
class MOONKNIGHTRPG_API AMKPlayerCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    AMKPlayerCharacter();

    virtual float TakeDamage(float DamageAmount, FDamageEvent const& DamageEvent,
        AController* EventInstigator, AActor* DamageCauser) override;

    UFUNCTION(BlueprintCallable, Category = "Combat")
    void LightAttack();

    UFUNCTION(BlueprintCallable, Category = "Combat")
    void Dodge();

    UFUNCTION(BlueprintCallable, Category = "Combat")
    void StartParry();

    UFUNCTION(BlueprintCallable, Category = "Combat")
    void ResetCombatState();

    //--- NO HEALING IN COMBAT ---//
    UFUNCTION(BlueprintCallable, Category = "Health")
    bool TryHealth(float Amount);

    UFUNCTION(BlueprintPure, Category = "Health")
    bool IsInCombat() const { return bInCombat; }

    UFUNCTION(BlueprintPure, Category = "Health")
    float GetHealthPercent() const { return MaxHealth > 0.f ? CurrentHealth / MaxHealth : 0.f; }

protected:
    virtual void BeginPlay() override;

    UFUNCTION(BlueprintImplementableEvent, Category = "Death")
    void OnDeathFadeStart(float FadeDuration);

    UFUNCTION(BlueprintImplementableEvent, Category = "Combat")
    void OnComboAttack(int32 ComboIndex);

    void HandleDeath();
    void Respawn();

    //--- STATE ---//
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
    float MaxHealth = 100.f;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Health")
    float CurrentHealth = 100.f;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Combat")
    ECombatState CombatState = ECombatState::Idle;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Combat")
    EWeaponType EquippedWeapon = EWeaponType::Sword;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Combat")
	  int32 ComboCounter = 0;

    UPROPERTY(EditAnywhere, Category = "Combat")
	  int32 MaxComboLength = 4;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Combat")
	  bool bInCombat = false;

    FTimerHandle RespawnTimerHandle;
    FTimerHandle ComboResetTimerHandle;
};
`,
      },
    },
    {
      id: "single-source-of-truth",
      kicker: "Tuning",
      title: "A single source of truth for tuning",
      decision:
        "No magic numbers anywhere. Every design constant lives in a MoonKnightConstants namespace, and every shared enum — ECombatState, EWeaponType — is defined exactly once.",
      why: [
        "Each constant is traceable back to a line in the GDD. When the design document says the combo window is 0.8 seconds, there is exactly one place in the codebase where that number exists, and it has a name.",
        "Balance passes become a diff of one file instead of a search across a dozen. On a solo project that is the difference between tuning the game and doing archaeology on it.",
        "Shared enums defined once means Blueprint dropdowns and C++ switches cannot drift apart. Adding a weapon type is one edit, and every consumer picks it up.",
      ],
      code: {
        filename: "MoonKnightRPG.h",
        language: "cpp",
        code: `//===================================================//
//------------------- GAME MODULE -------------------//
//===================================================//

#pragma once

#include "CoreMinimal.h"
#include "MoonKnightRPG.generated.h"
#include <cstdint>


UENUM(BlueprintType)
enum class ECombatState : uint8
{
    Idle            UMETA(DisplayName = "Idle"),
    Attacking       UMETA(DisplayName = "Attacking"),  
    Dodging         UMETA(DisplayName = "Dodging"),    
    Parrying	      UMETA(DisplayName = "Parrying"),
	  Staggered	      UMETA(DisplayName = "Staggered"),
    Dead            UMETA(DisplayName = "Dead")
};

ENUM(BlueprintType)
enum class EWeaponType : uint8
{
    Sword   UMETA(DisplayName = "Sword"),
    Bow     UMETA(DisplayName = "Bow")
};


namespace MoonKnightConstants 
{
    //--- Death and Respawn ---
    constexpr float DeathFadeDuration      = 5.0f;
    constexpr float RespawnDelay           = 4.9f;

    //--- Enemy Perception (sound and sight) ---
    constexpr float EnemySightRadius       = 1200.0f;
    constexpr float EnemySightAngleDegrees = 90.0f;
    constexpr float EnemyHearingRadius     = 800.0f;
    
    //--- Skill tree caps ---
    constexpr float MaxBowDamageBonus      = 100.0f;
}
`,
      },
    },
    {
      id: "damage-through-engine",
      kicker: "Damage",
      title: "Damage flows through the engine, not around it",
      decision:
        "Nothing subtracts health directly. Every damage source in the game — sword traces, enemy attacks, environmental hazards — goes through the engine's TakeDamage override.",
      why: [
        "One funnel means one place to put the rules. Parry negation and death handling live inside TakeDamage, so a new damage source inherits both for free and cannot forget to check them.",
        "Writing against Unreal's own damage pipeline rather than a bespoke one keeps the code legible to anyone who knows the engine, and keeps DamageCauser, EventInstigator and damage types available instead of reinvented.",
        "It made the parry testable. Because negation is a single branch in a single function, it can be reasoned about in isolation rather than chased through every attacker in the game.",
      ],
      code: {
        filename: "MKPlayerCharacter.cpp",
        language: "cpp",
        code: `float AMKPlayerCharacter::TakeDamage(float DamageAmount, FDamageEvent const& DamageEvent,
    AController* EventInstigator, AActor* DamageCauser)
{
    if (CombatState == ECombatState::Dead)
    {
        return 0.f;
    }

    //==================================//
    //--- PARRY TO HUMANOIDS ENEMIES ---//  
    //==================================//
    if (CombatState == ECombatState::Parrying)
    {
        return 0.f;
    }

    const float Applied = Super::TakeDamage(DamageAmount, DamageEvent, EventInstigator, DamageCauser);
    CurrentHealth = FMath::Clamp(CurrentHealth - Applied, 0.f, MaxHealth);
    bInCombat = true;

    if (CurrentHealth <= 0.f)
    {
        HandleDeath();
    }
    return Applied;
}
`,
      },
    },
    {
      id: "perception-in-cpp",
      kicker: "AI",
      title: "Perception in C++, decisions in the tree",
      decision:
        "The AI controller configures sight and hearing in C++ and writes Blackboard keys — TargetActor, InvestigateLocation. The Behaviour Tree owns every decision made from them.",
      why: [
        "Perception config is exactly the kind of thing that should be code: radii, peripheral angle, affiliation, stimulus age. It is numeric, shared across every enemy, and needs to be identical between the werewolf and the standard patroller.",
        "Behaviour is exactly the kind of thing that should not be. Reordering a selector, adding an investigate branch, or giving the werewolf a different chase decorator is design work, and it happens in the tree without a recompile.",
        "The Blackboard is the seam. C++ only ever states facts — I can see this actor, I heard something there. The tree decides what those facts mean, so enemy behaviour stays designer-editable while detection stays exact.",
      ],
      code: {
        filename: "MKEnemyAIController.cpp",
        language: "cpp",
        code: `#include "MKEnemyAIController.h"
#include "Perception/AIPerceptionComponent.h"
#include "Perception/AISenseConfig_Sight.h"
#include "Perception/AISenseConfig_Hearing.h"
#include "BehaviorTree/BehaviorTree.h"
#include "BehaviorTree/BlackboardComponent.h"
#include "MKPlayerCharacter.h"

const FName AMKEnemyAIController::TargetActorKey(TEXT("TargetActor"));
const FName AMKEnemyAIController::InvestigateLocationKey(TEXT("InvestigateLocation"));

AMKEnemyAIController::AMKEnemyAIController()
{
    PerceptionComp = CreateDefaultSubobject<UAIPerceptionComponent>(TEXT("PerceptionComp"));

//===================================================//
//----------------- SIGHT DETECTION -----------------//
//===================================================//
    SightConfig = CreateDefaultSubobject<UAISenseConfig_Sight>(TEXT("SightConfig"));
    SightConfig->SightRadius = MoonKnightConstants::EnemySightRadius;
    SightConfig->LoseSightRadius = MoonKnightConstants::EnemySightRadius * 1.25f;
    SightConfig->PeripheralVisionAngleDegrees = MoonKnightConstants::EnemySightAngleDegrees;
    SightConfig->DetectionByAffiliation.bDetectEnemies = true;
    SightConfig->DetectionByAffiliation.bDetectNeutrals = true;
    SightConfig->DetectionByAffiliation.bDetectFriendlies = false;

//===================================================//
//----------------- HEAR DETECTION ------------------//
//===================================================//
    HearingConfig = CreateDefaultSubobject<UAISenseConfig_Hearing>(TEXT("HearingConfig"));
    HearingConfig->HearingRange = MoonKnightConstants::EnemyHearingRadius;
    HearingConfig->DetectionByAffiliation.bDetectEnemies = true;
    HearingConfig->DetectionByAffiliation.bDetectNeutrals = true;

    PerceptionComp->ConfigureSense(*SightConfig);
    PerceptionComp->ConfigureSense(*HearingConfig);
    PerceptionComp->SetDominantSense(SightConfig->GetSenseImplementation());

    PerceptionComp->OnTargetPerceptionUpdated.AddDynamic(
        this, &AMKEnemyAIController::OnTargetPerceptionUpdated);
}

void AMKEnemyAIController::OnPossess(APawn* InPawn)
{
    Super::OnPossess(InPawn);

    if (BehaviorTreeAsset)
    {
        RunBehaviorTree(BehaviorTreeAsset);
    }
}

void AMKEnemyAIController::OnTargetPerceptionUpdated(AActor* Actor, FAIStimulus Stimulus)
{
    UBlackboardComponent* BB = GetBlackboardComponent();
    if(!BB)
    {
        return;
    }


    if (AMKPlayerCharacter* Player = Cast<AMKPlayerCharacter>(Actor))
    {
        if (Stimulus.WasSuccessfullySensed())
        {
            BB->SetValueAsObject(TargetActorKey, Actor);
            BB->SetValueAsVector(InvestigateLocationKey, Stimulus.StimulusLocation);
        }
        return;
    }

    if (Stimulus.WasSuccessfullySensed())
    {
        BB->SetValueAsVector(InvestigateLocationKey, Stimulus.StimulusLocation);
    }
}
`,
      },
    },
    {
      id: "state-ownership",
      kicker: "Persistence",
      title: "State ownership follows lifetime",
      decision:
        "Anything that must outlive the actor holding it lives in the Game Instance — the one object guaranteed to exist for the whole session.",
      why: [
        "The player character is destroyed and respawned on death. Levels stream in and out. Any variable stored on an actor is therefore only as durable as that actor, which is not durable at all.",
        "The Willow Tree checkpoint and the equipped weapon both have to survive both events, so both belong to UMKGameInstance. Exactly one exists per session, and it outlives every level and every respawn.",
        "This was the fix for a real bug: equipment was resetting on level load. The instinct is to patch it — re-apply the weapon in BeginPlay, cache it on the controller, add a save call. The actual fix was to ask which object was supposed to own that state in the first place, and the answer was none of the ones I had been patching.",
      ],
      code: {
        filename: "MKGameInstance.h",
        language: "cpp",
        code: `#pragma once

#include "CoreMinimal.h"
#include "Engine/GameInstance.h"
#include "MKPlayerCharacter.h"
#include "MoonKnightRPG.h"
#include "MKGameInstance.generated.h"

class AMKPlayerCharacter;

UCLASS()
class MOONKNIGHTRPG_API UMKGameInstance : public UGameInstance
{
    GENERATED_BODY()

public:
//------------- WILLOW TREE CHECKPOINTS -------------//
    UFUNCTION(BlueprintCallable, Category = "Checkpoint")
    void RegisterWillowTree(const FVector& TreeLocation);

    UFUNCTION(BlueprintCallable, Category = "Checkpoint")
    void RespawnAtLastWillowTree(AMKPlayerCharacter* Player);

    UFUNCTION(BlueprintPure, Category = "Checkpoint")
    bool HasCheckpoint() const { return bHasCheckpoint; }

//--------------- EQUIPMENT PERSISTENCE ---------------//
    UFUNCTION(BlueprintCallable, Category = "Equipment")
    void SaveEquippedWeapon(EWeaponType Weapon) { SavedWeapon = Weapon; }

    UFUNCTION(BlueprintPure, Category = "Equipment")
    EWeaponType GetSavedWeapon() const { return SavedWeapon; }

protected:
    UPROPERTY(VisibleAnywhere, Category = "Checkpoint")
    FVector LastWillowTreeLocation = FVector::ZeroVector;

    UPROPERTY(VisibleAnywhere, Category = "Checkpoint")
    bool bHasCheckpoint = false;

    UPROPERTY(VisibleAnywhere, Category = "Equipment")
    EWeaponType SavedWeapon = EWeaponType::Sword;
};
`,
      },
    },
  ] as CodingChoice[],

  /* ---------------------------------------------------------------- */

  combat: {
    kicker: "System deep-dive",
    title: "The combat state machine",
    intro:
      "Moon-Knight has no block. Defence is a parry or it is a dodge, and both cost commitment, which is what makes aggression the correct answer rather than the reckless one. That design reads straight off the state machine: there is no defensive state you can simply hold.",
    states: [
      {
        name: "Idle",
        detail: "Free movement. The only state that accepts every input.",
        exits: "Attacking · Dodging · Parrying",
      },
      {
        name: "Attacking",
        detail:
          "Up to a 4-hit chain. ComboCounter advances on an input inside the window; an auto-reset timer returns to Idle when it lapses.",
        exits: "Attacking (next hit) · Idle (timer lapse)",
        accent: "gold",
      },
      {
        name: "Dodging",
        detail: "A committed roll with invulnerability frames. Cannot be cancelled into an attack.",
        exits: "Idle",
      },
      {
        name: "Parrying",
        detail:
          "A timed window. A hit landing inside it is negated outright in TakeDamage — not reduced.",
        exits: "Idle · Staggered (missed window)",
        accent: "emerald",
      },
      {
        name: "Staggered",
        detail: "The cost of a mistimed defence. Input is locked until recovery finishes.",
        exits: "Idle · Dead",
        accent: "scarlet",
      },
      {
        name: "Dead",
        detail:
          "Death handling runs, the Game Instance is read for the last checkpoint, and the player respawns at the Willow Tree.",
        exits: "Idle (respawn at last Willow Tree)",
        accent: "scarlet",
      },
    ] as CombatState[],
    code: {
      filename: "MKPlayerCharacter.cpp",
      language: "cpp",
      code: `void AMKPlayerCharacter::LightAttack()
{
    if (CombatState == ECombatState::Dead || CombatState == ECombatState::Staggered)
    {
        return;
    }

    //===================================//
    //---------- ADVANCE COMBO ---------//
    //==================================//
    ComboCounter = (ComboCounter % MaxComboLength) + 1;
    CombatState = ECombatState::Attacking;
    bInCombat = true;
    OnComboAttack(ComboCounter);

    //=========================================//
    //--- RESET THE COMBO WITHOUT FOLLOW-UP ---//
    //=========================================//
    GetWorldTimerManager().SetTimer(ComboResetTimerHandle, this,
        &AMKPlayerCharacter::ResetCombatState, 1.2f, false);
}

void AMKPlayerCharacter::Dodge()
{
    if (CombatState == ECombatState::Dead)
    {
        return;
    }

    //=========================================//
    //------------ NO STAMINA LOSS ------------//
    //=========================================//
    CombatState = ECombatState::Dodging;
}

void AMKPlayerCharacter::StartParry()
{
    if (CombatState == ECombatState::Idle || CombatState == ECombatState::Dodging)
    {
        CombatState = ECombatState::Parrying;
    }
}

void AMKPlayerCharacter::ResetCombatState()
{
	if (CombatState != ECombatState::Dead)
	{
		CombatState = ECombatState::Idle;
		ComboCounter = 0;
	}
}

void AMKPlayerCharacter::HandleDeath()
{
    CombatState = ECombatState::Dead;
    DisableInput(Cast<APlayerController>(GetController()));

    OnDeathFadeStart(MoonKnightConstants::DeathFadeDuration);

    GetWorldTimerManager().SetTimer(RespawnTimerHandle, this,
        &AMKPlayerCharacter::Respawn, MoonKnightConstants::RespawnDelay, false);
}


//=========================================//
//---------- WILLOW TREE RESPAWN ----------//
//=========================================//
void AMKPlayerCharacter::Respawn()
{
    if (UMKGameInstance* GI = Cast<UMKGameInstance>(UGameplayStatics::GetGameInstance(this)))
    {
        GI->RespawnAtLastWillowTree(this);
    }
    CurrentHealth = MaxHealth;
    ResetCombatState();
    EnableInput(Cast<APlayerController>(GetController()));
}
`,
    },
  },

  /* ---------------------------------------------------------------- */

  screenshots: {
    kicker: "From the editor",
    title: "The Blueprint side",
    intro:
      "These captures are the Blueprint half of the split. Some of them are also its history: the combat chain and the sword trace were prototyped as the graphs below and later moved into C++, because iterating a montage window in Blueprint takes seconds and shipping it does not. What survives in Blueprint is what genuinely reads better as a graph than as code — the trees, the tuning, the generation. Click any capture to read it full size.",
    items: [
      {
        id: "bt-standard",
        label: "Behaviour Tree — standard enemy",
        caption:
          "The patrol / investigate / chase selector, reading the TargetActor and InvestigateLocation keys the C++ controller writes. Still Blueprint: a decision tree is a diagram, and it is easier to reason about as one.",
        src: "/images/moon-knight/BT_AI.png",
        alt:
          "Unreal Behaviour Tree for the standard enemy: a root selector branching into patrol, investigate and chase sequences, with Blackboard decorators gating each branch.",
      },
      {
        id: "bt-werewolf",
        label: "Behaviour Tree — werewolf",
        caption:
          "The boss variant. Same Blackboard contract, different decision structure and a more aggressive chase decorator — which is the point of keeping the contract in C++ and the decisions in the tree.",
        src: "/images/moon-knight/BT_Werewolf.png",
        alt:
          "Unreal Behaviour Tree for the werewolf boss: the same Blackboard keys as the standard enemy driving a shallower, more aggressive branch structure.",
      },
      {
        id: "combo-chain",
        label: "Combo chain — BPC_Attack System",
        caption:
          "The 4-hit montage sequencing and the combo-continuation gate. Prototyped here, then reimplemented in C++ so the ComboCounter has one owner and the window timing survives a level load.",
        src: "/images/moon-knight/Combat_System_Blueprints.png",
        alt:
          "The whole BPC_Attack System graph: attack input, montage sequencing, the combo continuation gate, and the stop-combo path, drawn as one Blueprint.",
      },
      {
        id: "sword-trace",
        label: "Sword trace & ApplyDamage",
        caption:
          "The weapon trace during the active frames of each swing — sphere radius 12, base damage 20, filtered on a Damageable tag — funnelling into the engine's damage pipeline. The trace stayed Blueprint while it was being tuned and moved to C++ once the numbers stopped changing.",
        src: "/images/moon-knight/Sword_Trace.png",
        alt:
          "Blueprint sword trace: a sphere trace along the blade during the active frames, tag-filtered, calling ApplyDamage into Unreal's own damage pipeline.",
      },
      {
        id: "target-lock",
        label: "Target lock",
        caption:
          "Lock-on selection and the camera behaviour that follows it: a 200-unit sphere trace against PhysicsBody and Pawn, tag-filtered, storing the actor the camera then tracks.",
        src: "/images/moon-knight/Target_Lock.png",
        alt:
          "Blueprint target-lock graph: a 200-unit sphere trace selecting the nearest tagged enemy and storing it for the camera to follow.",
      },
      {
        id: "wb-equipment",
        label: "WB_Equipment — the equipment screen",
        caption:
          "The one conventional menu in the game, and the reason the diegetic thesis on the main page is scoped rather than absolute. Swapping a sword for a bow is a rare, deliberate act performed in safety, and it wants a grid you can compare in — not a gesture. Built in UMG against the DB_Items data table, so a new item is a row rather than a widget.",
        src: "/images/moon-knight/WB_Equipment.png",
        alt:
          "The WB_Equipment widget open in Unreal's UMG designer: a canvas with the character viewport in the centre and labelled Bow, Sword and Armor equipment slots down the right, with the widget hierarchy listed beside it.",
      },
      {
        id: "pcg-forest",
        label: "PCG forest — the level's ground cover",
        caption:
          "Three labelled lanes — rocks, trees, grass — each sampling the terrain and then differencing against the others so nothing spawns inside anything else. This is the graph behind the claim on the level-design page that the forest is authored, not randomised, and it is the clearest case for the split: nobody wants to tune this in code.",
        src: "/images/moon-knight/PCG_Forest.png",
        alt:
          "Unreal PCG graph with three lanes for rocks, trees and grass, each sampling the landscape and differencing against the other lanes so placements never overlap.",
      },
    ] as ScreenshotSlot[],
  },

  /* ---------------------------------------------------------------- */

  quantumCta: {
    kicker: "The research branch",
    title: "The quantum research built within this game",
    body:
      "The systems on this page are the foundation — the shipped, playable game. Built inside it is a second, more specialised piece of engineering: five combat abilities derived from real quantum computing principles, backed by a hand-written C++17 simulation library and validated statistically against the analytic predictions. That work has its own deep-dive.",
    href: "/moon-knight/engineering/quantum",
    linkLabel: "Read the quantum toolkit deep-dive",
  },
};
