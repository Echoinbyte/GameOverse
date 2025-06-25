"use client";

import { GamePair } from "@/types";
import GamePairCard from "./GamePairCard";
import AddPairButton from "./AddPairButton";

interface GamePairsEditorProps {
  pairs: GamePair[];
  onUpdatePair: (
    id: string,
    field: "term" | "definition",
    value: string
  ) => void;
  onRemovePair: (id: string) => void;
  onAddPair: () => void;
}

export default function GamePairsEditor({
  pairs,
  onUpdatePair,
  onRemovePair,
  onAddPair,
}: GamePairsEditorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Game Pairs</h2>
      </div>

      <div className="space-y-6">
        {pairs.map((pair, index) => (
          <GamePairCard
            key={pair.id}
            pair={pair}
            index={index}
            canRemove={pairs.length > 1}
            onUpdate={onUpdatePair}
            onRemove={onRemovePair}
          />
        ))}

        <AddPairButton onAdd={onAddPair} />
      </div>
    </div>
  );
}
