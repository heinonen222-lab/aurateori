export type SceneKind =
  | "intersection"
  | "braking"
  | "signs"
  | "driver"
  | "eco"
  | "vehicle"
  | "motorway"
  | "overtake"
  | "parking"
  | "night"
  | "ice"
  | "license";

export const LESSON_SCENE: Record<string, SceneKind> = {
  vajningsregler: "intersection",
  "hastighet-stoppstracka": "braking",
  "vagmarken-system": "signs",
  "manniskan-trafiken": "driver",
  "miljo-ekonomi": "eco",
  fordonet: "vehicle",
  motorvag: "motorway",
  omkorning: "overtake",
  "stanna-parkera": "parking",
  "morker-belysning": "night",
  "halt-vaglag": "ice",
  "korkort-ansvar": "license",
};