'use client';

import * as React from 'react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { Label } from './ui/label';

interface ButtonOption {
  value: string;
  label: string;
}

interface ButtonToggleProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  buttons: ButtonOption[];
}

export default function ButtonToggle({
  id,
  label,
  value,
  onChange,
  buttons,
}: ButtonToggleProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        {buttons.map((btn) => (
          <Button
            key={btn.value}
            variant="outline"
            type="button"
            size="lg"
            className={cn(
              'flex-1 transition-colors',
              value === btn.value && 'bg-blue text-white hover:bg-blue/90 hover:text-white'
            )}
            onClick={() => onChange(btn.value)}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
