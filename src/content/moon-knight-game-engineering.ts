export interface CodeSlot {
  filename: string;
  language: string;
  code: string;
}

export interface SplitRow {
  system: string;
  detail: string;
  home: "Blueprint" | "C++";
  owner: string;
}

export interface CodingChoice {
  id: string;
  kicker: string;
  title: string;
  decision: string;
  why: string[];
  code: CodeSlot;
}

export interface CombatState {
  name: string;
  detail: string;
  exits: string;
  accent?: "gold" | "scarlet" | "emerald";
}

export interface ScreenshotSlot {
  id: string;
  label: string;
  caption: string;
  src?: string;
  alt?: string;
}

export const gameEngineering = {
  eyebrow: "GAME PROGRAMMING · UNREAL ENGINE 5 · C++ & BLUEPRINTS · SOLO",
  title: "Programming Moon-Knight",
  thesis: "C++ for handling the logic. Blueprints for handling the presentation.",

  tagline:
    "A solo UE5 dark-fantasy RPG with every core system designed and built from scratch: combat, AI, persistence, and equipment.",

  intro:
    "Moon-Knight is a solo project, meaning I functioned as a designer and as a engineer and I had to code, debug and tune every aspect of the game. " +
    "My approach for combining C++ and Unreal's Blueprints was a matter of timing and visuals. I used C++ for the states, lifetime, damage, " +
    "and every logic system, while I used Blueprints for combos animations, trace windows or behaviour trees. " +
    "The reasoning was the speed in development and what needed to to be delivered. Below this are the decisions.",

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
    kicker: "The division",
    title: "What is in a Blueprint. What is in C++",
    intro:"The main reason for deciding which things should go to C++ were what the level loaded, then it needed to be managed in the code. " +
          "If something needed to exist, tuned or feel right on a specific frame, I managed it in the Blueprints." +
          "This is how the code architecture was distributed:",
    rows: [
      {
        system: "Combat Combo Chain",
        detail: "Montage sequencing, sword trace and calling ApplyDamage",
        home: "Blueprint",
        owner: "BPC_Attack System",
      },
      {
        system: "Enemy Behaviour",
        detail: "Behaviour Trees, Blackboard and Patrol Tasks",
        home: "Blueprint",
        owner: "BD_AI, BD_Werewolf",
      },
      {
        system: "AI Perception",
        detail: "Detection, Sight and Hearing Stimulus, Blackboard Writes",
        home: "C++",
        owner: "AMKEnemyAIController",
      },
      {
        system: "Inventory & Equipment",
        detail: "Data Table Lookup, Equip Socket Swap",
        home: "Blueprint",
        owner: "BPC_Equipment System",
      },
      {
        system: "Player Systems",
        detail: "Health, Combo State, Death and Respawn",
        home: "C++",
        owner: "AMKPlayerCharacter",
      },
      {
        system: "Session Persistence",
        detail: "Willow Tree Checkpoints, Equipped Weapon",
        home: "C++",
        owner: "UMKGameInstance",
      },
    ] as SplitRow[],
  },

  /* ---------------------------------------------------------------- */

  choicesKicker: "The decisions",
  choicesTitle: "The Five Coding Choices That Shaped The Game",

  choices: [
    {
      id: "hybrid-architecture",
      kicker: "Architecture",
      title: "The Hybrid Architecture",
      decision:
        "When I prototyped the game for the first time, I useed Blueprints. Then I decided to transition part of the code to C++, so " +
        "I had to make the Blueprints call down into C++, through BlueprintCallable; and C++ call up to a Blueprint using BlueprintImplementableEvent.",
      why: [
        "One of the reasons for this was to reduce ambiguity when a bug appeared. If the wrong thing happened it was a C++ issue, " +
        "however, if the right thing happened but looked weird, it was a Bluprint issue. ",
        "I could also tune animations quicker without having to compile the whole code every single time.",
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
      title: "Single Source for Tuning",
      decision:
        "The design constants were given a const in the MoonKnightConstants namespace. Also, the shared enum, ECombatState and EWeaponType, wre defined once. ",
      why: [
        "Every constat variable is the exact number that was given in the GDD, so there wouldn't be any conflicts between the design and the code.",
        "For a better tuning of values, I moved them to one file so I only had to look in one place.",
        "The enums for the weapon types were defined once and shared, preventing conflicts between the Blueprints and the C++, making edits automatic and quick.",
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
      title: "The Damage Functions Inside the Engine",
      decision:
        "The health is substracted inside the engine. All the damage is handled in the game, swords or enemies' attacks, just overrides TakeDamage.",
      why: [
        "This puts all the system in one place. The parry negation and death are inside the TakeDamage, so any new damage source will jus inherit both",
        "It keeps DamageCauser, EventInstigator and any other damage types available, keeping the code easy to read.",
        "The parry was easy to test as the addition after the migration to C++. I could isolate the mechanic and tune it.",
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
      title: "Enemy Perception in C++",
      decision:
        "The AI controller sets the sight and hearing stimulus in C++, wrting Blackboard keys like TargetActor, InvestigateLocation. I just needed to change from the Behaviour Tree.",
      why: [
        "The perception had so many things that needed to be tuned and C++ was the right decision. Things like radii, peripheral angle, affiliation or stimulus age are numerical and shared and sometimes needed to be the same for different enemies",
        "The design side was already decided, so I didn't need to reorder selectors or add investigate branches. That could ust happen in the Behaviour Trees.",
        "The Blackboard is the perfect connection between these two. The C++ code only stated facts and the Blueprint decided what to do in those moments, so it just meant a matter of handle what to do and the order in those cases.",
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
      title: "The Data Should Last",
      decision:
        "Anything that had to be longer than the actor was present in the Game Instance. It guaranteed to exist the whole time.",
      why: [
        "There were some things that needed to be destroyed eventually, like the character or the levels. These things relied on the 3D objects.",
        "The Willow Tree's checkpoint and the inventory had to survive death and respawn, so I placed them in UMKGameInstance.",
        "This was actually a bug had I couldn't fix for a long time. The equipment system disappeared when the character died. I tried to add this to BeginPLay, but the better option was to ask which object was supposed to own that state.",
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
    title: "The Combat State Machine",
    intro:
      "Moon-Knight has no block. Defence is a parry or a dodge, which is what makes the gameplay aggressive and fast-paced. That design can be seen in the combat state machine as there is no defensive state.",
    states: [
      {
        name: "Idle",
        detail: "Free movement. It accepts every input.",
        exits: "Attacking · Dodging · Parrying",
      },
      {
        name: "Attacking",
        detail:
          "Up to a 4-hit combo chain. ComboCounter advances the animations and an auto-reset timer returns to Idle when it gets to last move.",
        exits: "Attacking (next hit) · Idle (timer lapse)",
        accent: "gold",
      },
      {
        name: "Dodging",
        detail: "A roll with invulnerability frames. Cannot be cancelled into an attack.",
        exits: "Idle",
      },
      {
        name: "Parrying",
        detail:
          "A narrow timed window. A hit landing inside it is negated outright in TakeDamage.",
        exits: "Idle · Staggered (missed window)",
        accent: "emerald",
      },
      {
        name: "Staggered",
        detail: "The cost of TakeDamage. The input is locked until the recovery finishes.",
        exits: "Idle · Dead",
        accent: "scarlet",
      },
      {
        name: "Dead",
        detail:
          "The death handling. The Game Instance checks the last checkpoint and the player respawns there.",
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
    title: "The Blueprints",
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
