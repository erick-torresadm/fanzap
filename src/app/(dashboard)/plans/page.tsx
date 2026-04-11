'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
  { name: 'Gratuito', price: 'R$ 0', features: ['1 instância', '1 fluxo', '50 msgs'] },
  { name: 'Básico', price: 'R$ 97', features: ['3 instâncias', '5 fluxos', '1.000 msgs'] },
  { name: 'Pro', price: 'R$ 297', features: ['10 instâncias', 'Fluxos ilimitados', '10.000 msgs'] },
];

export default function PlansPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Planos</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className="p-6">
            <CardTitle className="text-lg mb-2">{plan.name}</CardTitle>
            <div className="text-3xl font-bold mb-4">{plan.price}</div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400" />
                  {f}
                </li>
              ))}
            </ul>
            <Button className="w-full" variant={plan.name === 'Básico' ? 'default' : 'outline'}>
              {plan.name === 'Básico' ? 'Atual' : 'Escolher'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}