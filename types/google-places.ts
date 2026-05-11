export type Match = {
  endOffset: number;
};
export type StructuredFormat = {
  mainText: SuggestionText;
  secondaryText: {
    text: string;
  };
};
export type PlacePrediction = {
  place: string;
  placeId: string;
  text: SuggestionText;
  structuredFormat: StructuredFormat;
  types: string[];
};
export type SuggestionText = {
  text: string;
  matches: Match[];
};
export type Suggestion = {
  placePrediction: PlacePrediction;
};
export type Suggestions = {
  suggestions: Suggestion[];
};
