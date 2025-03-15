'use client';

import * as React from 'react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { Label } from './ui/label';

interface ListingTypeToggleProps {
  id: string;
  label: string;
  listingType: 'buy' | 'rent';
  onClick1: () => void;
  onClick2: () => void;
  btnText1: string;
  btnText2: string;
}
export default function ListingTypeToggle({
  id,
  label,
  listingType,
  onClick1,
  onClick2,
  btnText1,
  btnText2,
}: ListingTypeToggleProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Button
          variant="outline"
          type='button'
          size="lg"
          className={cn(
            'flex-1 transition-colors',
            listingType === 'buy' && 'bg-blue text-white hover:bg-blue/90'
          )}
          onClick={onClick1}>
          {btnText1}
        </Button>
        <Button
          variant="outline"
          type='button'
          size="lg"
          className={cn(
            'flex-1 transition-colors',
            listingType === 'rent' && 'bg-blue text-white hover:bg-blue/90'
          )}
          onClick={onClick2}>
          {btnText2}
        </Button>
      </div>
    </div>
  );
}
