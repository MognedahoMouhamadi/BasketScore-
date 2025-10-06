// utils/id.ts
export const newMatchId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
