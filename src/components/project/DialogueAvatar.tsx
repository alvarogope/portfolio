"use client";

import KnightHead from "./KnightHead";

export default function DialogueAvatar({
  speaking,
}: {
  speaking: boolean;
}) {
  return (
    <div
      className={speaking ? "avatar-speak" : ""}
      aria-hidden
      style={{
        width: 96,
        height: 96,
        flex: "0 0 auto",
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width="96"
        height="96"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        <KnightHead mouth="animated" />
      </svg>

      <style>{`
        @keyframes avatarSpeak {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        .avatar-speak {
          animation: avatarSpeak 0.42s ease-in-out infinite;
        }

        /* The mouth. At rest only the closed frame is visible; while
           speaking the two frames alternate. The 0.3s period is
           deliberately not a factor of the 0.42s bob, so the head
           movement and the jaw drift in and out of phase instead of
           locking into an obviously mechanical loop. */
        .avatar-mouth-open { opacity: 0; }

        @keyframes avatarMouthClosed {
          0%, 49%   { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        @keyframes avatarMouthOpen {
          0%, 49%   { opacity: 0; }
          50%, 100% { opacity: 1; }
        }

        .avatar-speak .avatar-mouth-closed {
          animation: avatarMouthClosed 0.3s steps(1) infinite;
        }

        .avatar-speak .avatar-mouth-open {
          animation: avatarMouthOpen 0.3s steps(1) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .avatar-speak,
          .avatar-speak .avatar-mouth-closed,
          .avatar-speak .avatar-mouth-open {
            animation: none;
          }
          /* Rest on the closed mouth, never mid-word. */
          .avatar-mouth-open { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
