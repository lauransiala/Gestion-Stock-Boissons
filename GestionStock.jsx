import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const boissons = [
  { nom: 'Coca', prix: 3000 },
  { nom: 'Fanta', prix: 3000 },
  { nom: 'Sprite', prix: 3000 },
  { nom: 'Vital\'O', prix: 3000 },
  { nom: 'Maltina', prix: 2500 },
  { nom: 'Energie Malt', prix: 2500 },
  { nom: 'Castel', prix: 4000 },
  { nom: 'Beaufort', prix: 4000 },
  { nom: 'Turbo', prix: 3500 },
  { nom: 'Heineken', prix: 4000 },
  { nom: 'Nkoy', prix: 5000 }
];

const TAUX_CHANGE = 2872;

const GestionStocks = () => {
  const [ventes, setVentes] = useState(() => {
    const savedVentes = localStorage.getItem('ventes');
    return savedVentes ? JSON.parse(savedVentes) : {};
  });

  useEffect(() => {
    localStorage.setItem('ventes', JSON.stringify(ventes));
  }, [ventes]);

  const ajouterVente = (boisson) => {
    setVentes((prev) => ({
      ...prev,
      [boisson]: (prev[boisson] || 0) + 1
    }));
  };

  const retirerVente = (boisson) => {
    setVentes((prev) => ({
      ...prev,
      [boisson]: Math.max((prev[boisson] || 0) - 1, 0)
    }));
  };

  const remettreAZero = () => {
    if (window.confirm('Es-tu sûr de vouloir remettre à zéro toutes les ventes ?')) {
      setVentes({});
    }
  };

  const exporterVentes = () => {
    const data = Object.entries(ventes)
      .map(([boisson, quantite]) => {
        const item = boissons.find((b) => b.nom === boisson);
        const totalCDF = item.prix * quantite;
        const totalUSD = (totalCDF / TAUX_CHANGE).toFixed(2);
        return `${boisson} : ${quantite} ventes | ${totalCDF} CDF | ${totalUSD} USD`;
      })
      .join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ventes_boissons.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {boissons.map(({ nom, prix }) => (
        <motion.div key={nom} whileTap={{ scale: 0.95 }}>
          <Card className="p-4 flex flex-col items-center">
            <CardContent className="text-center">
              <h3 className="text-lg font-bold">{nom}</h3>
              <p className="text-sm">Prix : {prix} CDF</p>
              <p className="text-sm">Ventes : {ventes[nom] || 0}</p>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => ajouterVente(nom)} className="bg-green-500 text-white">+1</Button>
                <Button onClick={() => retirerVente(nom)} className="bg-red-500 text-white">-1</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      <Button onClick={exporterVentes} className="col-span-2 bg-blue-500 text-white">Exporter les Ventes</Button>
      <Button onClick={remettreAZero} className="col-span-2 bg-gray-500 text-white">Remettre à Zéro</Button>
    </div>
  );
};

export default GestionStocks;
