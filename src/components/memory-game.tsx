'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const cardEmojis = ['🤖', '🚀', '⭐', '🎉', '💡', '💻', '🧠', '🔥', '👍', '❤️', '😂', '😯'];

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const levels = {
  easy: { pairs: 6, label: 'Easy' },
  medium: { pairs: 8, label: 'Medium' },
  hard: { pairs: 12, label: 'Hard' },
};

export default function MemoryGame() {
  const [level, setLevel] = useState('easy');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const setupGame = (currentLevel: string) => {
    const { pairs } = levels[currentLevel as keyof typeof levels];
    const gameEmojis = cardEmojis.slice(0, pairs);
    const duplicatedEmojis = [...gameEmojis, ...gameEmojis];
    const shuffledEmojis = duplicatedEmojis.sort(() => Math.random() - 0.5);
    setCards(
      shuffledEmojis.map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
    );
    setMoves(0);
    setGameOver(false);
    setFlippedCards([]);
  };

  useEffect(() => {
    setupGame(level);
  }, [level]);

  const handleCardClick = (clickedCard: Card) => {
    if (timeout.current) clearTimeout(timeout.current);
    if (flippedCards.length === 2 || clickedCard.isFlipped || gameOver) return;

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      if (newFlippedCards[0].emoji === newFlippedCards[1].emoji) {
        // Match
        const matchedCards = newCards.map(card =>
          card.emoji === newFlippedCards[0].emoji ? { ...card, isMatched: true } : card
        );
        setCards(matchedCards);
        setFlippedCards([]);
        if (matchedCards.every(card => card.isMatched)) {
          setGameOver(true);
        }
      } else {
        // No match
        timeout.current = setTimeout(() => {
          const resetCards = newCards.map(card =>
            !card.isMatched ? { ...card, isFlipped: false } : card
          );
          setCards(resetCards);
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  const handleRestart = () => {
    setupGame(level);
  };

  return (
    <div className="w-full max-w-lg p-4 rounded-lg bg-card shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-card-foreground">Memory Game</h2>
        <div className="flex items-center gap-4">
           <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(levels).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleRestart} variant="outline">Restart</Button>
        </div>
      </div>
       <div className="mb-4 text-center">
        <p className="text-lg font-medium text-muted-foreground">Moves: {moves}</p>
      </div>
      
      {gameOver && (
        <div className="text-center mb-4 p-4 rounded-md bg-accent/20">
          <p className="text-xl font-semibold text-accent-foreground">
            🎉 You won in {moves} moves! 🎉
          </p>
        </div>
      )}

      <div className="memory-game">
        {cards.map(card => (
          <div
            key={card.id}
            className={`memory-card ${card.isFlipped ? 'flip' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            <div className="front-face">{card.emoji}</div>
            <div className="back-face"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
