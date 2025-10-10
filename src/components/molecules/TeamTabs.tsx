import React, { useState } from 'react';
import { Tab, TabView } from '@rneui/themed';
import PlayerList from './playerList';
import { Player } from './playerCard';

type TeamTabsProps = {
  playersA: Player[];
  playersB: Player[];
  onAdd: (team: 'A' | 'B') => void;
  onScore: (team: 'A' | 'B', index: number, points: number) => void;
  onEdit: (team: 'A' | 'B', index: number, newName: string) => void;
  onDelete: (team: 'A' | 'B', index: number) => void;
};

export default function TeamTabs({
  playersA,
  playersB,
  onAdd,
  onScore,
  onEdit,
  onDelete,
}: TeamTabsProps) {
  const [index, setIndex] = useState(0);

  return (
    <>
      <Tab
        value={index}
        onChange={setIndex}
        indicatorStyle={{ backgroundColor: '#ff4081', height: 3 }}
        variant="primary"
      >
        <Tab.Item title="Équipe A" />
        <Tab.Item title="Équipe B" />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{ width: '100%' }}>
          <PlayerList
            team="A"
            players={playersA}
            onAdd={onAdd}
            onScore={onScore}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </TabView.Item>
        <TabView.Item style={{ width: '100%' }}>
          <PlayerList
            team="B"
            players={playersB}
            onAdd={onAdd}
            onScore={onScore}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </TabView.Item>
      </TabView>
    </>
  );
}
