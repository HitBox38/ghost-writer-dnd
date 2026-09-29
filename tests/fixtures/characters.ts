import type { CharacterProfile } from "@/lib/types";
export const characterFixture: CharacterProfile = {
  id: "merrin",
  name: "Merrin Ashvale",
  race: "Half-elf",
  class: "Bard",
  level: 7,
  backstory: "A former court musician with a sharp tongue and a fondness for lost causes.",
  appearance: "A travel-worn coat and a silver earring.",
  worldSetting: "The Sword Coast",
  favorites: [],
  createdAt: 1700000000000,
  updatedAt: 1700000000000,
};
export const quipFixtures = [
  "I've heard sharper threats from a butter knife.",
  "Was that your battle cry? I thought someone had stepped on a very disappointed goose.",
  "All that armor, and still nothing to protect your dignity.",
  "You brought a sword to a conversation. How terribly on brand.",
  "I'd offer you a battle of wits, but I see you've come unarmed.",
  "Your technique has a certain charm. The charm of a chair falling down a staircase.",
  "Do give my regards to whoever taught you that. They owe you an apology.",
  "At last, an opponent who makes the training dummy look ambitious.",
  "Is this a duel or an audition? Either way, we'll be in touch.",
  "I admire your confidence. It's doing a remarkable amount of heavy lifting.",
  "Keep swinging. Even a broken clock gets two good moments a day.",
  "I've survived court banquets with more threatening cutlery than that.",
].map((text, index) => ({ id: `quip-${index}`, text }));
