import { SCENES } from "./constants";
import { ArrowUpRight } from "lucide-react";
import { Suggestion } from "@/components/ai-elements/suggestion";
import type { GenerationType } from "@/lib/types";
export const SceneStarters = ({
  type,
  onChoose,
}: {
  type: GenerationType;
  onChoose: (scene: string) => void;
}) => {
  return (
    <div className="scene-starters" aria-label="Scene starters">
      {SCENES[type].map(({ title, detail, Icon, prompt }) => (
        <Suggestion key={title} suggestion={prompt} onClick={onChoose} className="scene-starter">
          <Icon size={18} aria-hidden="true" />
          <span>
            <strong>{title}</strong>
            <span>{detail}</span>
          </span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </Suggestion>
      ))}
    </div>
  );
};
