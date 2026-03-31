import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // DOM specifikus matcherekhez (pl. toBeInTheDocument)
import { Button } from './button';

describe('Button Komponens', () => {
  it('sikeresen meg kell jelennie a megadott szöveggel', () => {
    render(<Button>Kattints ide</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /kattints ide/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('reagálnia kell a kattintási (click) eseményre', () => {
    // Mockolunk egy függvényt, amit ellenőrizhetünk
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>Teszt Gomb</Button>);
    const buttonElement = screen.getByRole('button', { name: /teszt gomb/i });
    
    // Kattintást szimulálunk
    fireEvent.click(buttonElement);
    
    // Ellenőrizzük, hogy meghívódott-e az eseménykezelő
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('alkalmaznia kell a különböző variáns classokat', () => {
    render(<Button variant="destructive">Törlés</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /törlés/i });
    // Ellenőrizzük, hogy rajta van-e a destructive variánshoz tartozó bg-destructive osztály
    expect(buttonElement).toHaveClass('bg-destructive');
  });
});
