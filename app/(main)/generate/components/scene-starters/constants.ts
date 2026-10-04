import { Flag, MessageCircle, Swords, Wine } from "lucide-react";
export const SCENES = {
  mockery: [
    {
      title: "A duel of wits",
      detail: "Put a pompous knight in their place.",
      Icon: Swords,
      prompt:
        "A pompous knight challenges me to a duel in front of my party. Give me a cutting reply.",
    },
    {
      title: "Trouble at the tavern",
      detail: "Have the last word before the first punch.",
      Icon: Wine,
      prompt:
        "A loudmouthed rival insults my party in a crowded tavern. I want a witty comeback that gets the room on our side.",
    },
    {
      title: "Face the villain",
      detail: "Meet a grand speech with a sharper line.",
      Icon: Flag,
      prompt:
        "The villain is delivering an overconfident speech. I interrupt with a memorable taunt before the battle begins.",
    },
  ],
  catchphrase: [
    {
      title: "Into the fray",
      detail: "A battle cry your party will remember.",
      Icon: Swords,
      prompt:
        "My party is about to charge into a difficult battle. I need a signature rallying cry.",
    },
    {
      title: "Raise a glass",
      detail: "Toast a victory, a friend, or a bad idea.",
      Icon: Wine,
      prompt:
        "We are celebrating a hard-won victory at the tavern. I raise a glass with a toast that captures my personality.",
    },
    {
      title: "Make an entrance",
      detail: "Introduce yourself with a little theater.",
      Icon: MessageCircle,
      prompt:
        "I introduce myself to a new group of adventurers. Give me a distinctive introduction they will remember.",
    },
  ],
} as const;
